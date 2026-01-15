// ════════════════════════════════════════════════════════════════════════════
// GERADOR DE QR CODE NFC-e
// ════════════════════════════════════════════════════════════════════════════
//! Geração de QR Code conforme NT 2019.001

use qrcode::render::svg;
use qrcode::QrCode;
use sha1::{Digest, Sha1};

/// Parâmetros para geração do QR Code
#[derive(Debug, Clone)]
pub struct QrCodeParams {
    pub access_key: String,
    pub uf: String,
    pub environment: u8,       // 1=Produção, 2=Homologação
    pub emission_date: String, // formato: YYYY-MM-DDTHH:MM:SS
    pub total_value: f64,
    pub digest_value: String, // SHA1 do XML em base64
    pub csc_id: String,
    pub csc: String,
}

pub struct QrCodeGenerator;

impl QrCodeGenerator {
    /// Gera URL do QR Code (Versão 2 - NFC-e 4.00)
    pub fn generate_url(params: &QrCodeParams) -> Result<String, String> {
        // URL base por UF e ambiente
        let base_url = Self::get_base_url(&params.uf, params.environment)?;

        // Versão 2 do QR Code (NT 2019.001)
        // chNFe=ChaveAcesso
        // nVersao=2
        // tpAmb=Ambiente
        // cIdToken=IdToken (CSC ID)
        // cHashQRCode=Hash(chNFe + nVersao + tpAmb + cIdToken + CSC)

        let n_versao = "2";
        let hash = Self::generate_hash_v2(params, n_versao)?;

        let url_params = format!(
            "chNFe={}&nVersao={}&tpAmb={}&cIdToken={:0>6}&cHashQRCode={}",
            params.access_key, n_versao, params.environment, params.csc_id, hash
        );

        Ok(format!("{}?{}", base_url, url_params))
    }

    /// Gera QR Code em formato SVG
    pub fn generate_svg(params: &QrCodeParams) -> Result<String, String> {
        let url = Self::generate_url(params)?;

        let code =
            QrCode::new(url.as_bytes()).map_err(|e| format!("Erro ao gerar QR Code: {}", e))?;

        let svg = code
            .render()
            .min_dimensions(200, 200)
            .dark_color(svg::Color("#000000"))
            .light_color(svg::Color("#ffffff"))
            .build();

        Ok(svg)
    }

    /// Gera QR Code em formato PNG
    pub fn generate_png(params: &QrCodeParams) -> Result<Vec<u8>, String> {
        let url = Self::generate_url(params)?;

        let code =
            QrCode::new(url.as_bytes()).map_err(|e| format!("Erro ao gerar QR Code: {}", e))?;

        // Renderizar como imagem
        let image = code
            .render::<image::Luma<u8>>()
            .min_dimensions(200, 200)
            .build();

        // Converter para PNG
        let mut buffer = std::io::Cursor::new(Vec::new());
        image
            .write_to(&mut buffer, image::ImageFormat::Png)
            .map_err(|e| format!("Erro ao gerar PNG: {}", e))?;

        Ok(buffer.into_inner())
    }

    fn get_base_url(uf: &str, environment: u8) -> Result<String, String> {
        // URLs de consulta QR Code por UF conforme NT 2019.001 v1.60
        let url = match (uf, environment) {
            // Produção
            ("SP", 1) => "https://nfe.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx",
            ("RJ", 1) => "http://www4.fazenda.rj.gov.br/consultaNFCe/QRCode",
            ("MG", 1) => "http://nfce.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml",
            ("RS", 1) => "https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx",
            ("PR", 1) => "http://www.fazenda.pr.gov.br/nfce/qrcode",

            // Homologação
            ("SP", 2) => "https://homologacao.nfe.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx",
            ("RJ", 2) => "http://www4.fazenda.rj.gov.br/consultaNFCe/QRCode",
            ("MG", 2) => "http://nfce.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml",
            ("RS", 2) => "https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx",
            ("PR", 2) => "http://www.fazenda.pr.gov.br/nfce/qrcode",

            _ => "https://nfce.svrs.rs.gov.br/ws/NFeConsultaQRCode/NFeConsultaQRCode.asn", // Fallback SVRS
        };

        Ok(url.to_string())
    }

    fn generate_hash_v2(params: &QrCodeParams, versao: &str) -> Result<String, String> {
        // cHashQRCode = SHA-1(chNFe + nVersao + tpAmb + cIdToken + CSC)
        // cIdToken deve ter 6 caracteres (zeros à esquerda)
        let c_id_token = format!("{:0>6}", params.csc_id);

        let data = format!(
            "{}{}{}{}{}",
            params.access_key, versao, params.environment, c_id_token, params.csc
        );

        let mut hasher = Sha1::new();
        hasher.update(data.as_bytes());
        let hash = hasher.finalize();

        // Hexadecimal em minúsculas (conforme NT)
        Ok(hex::encode(hash))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_params() -> QrCodeParams {
        QrCodeParams {
            access_key: "35260100123456780001906500100000000111234567890".to_string(),
            uf: "SP".to_string(),
            environment: 2,
            emission_date: "2026-01-02T10:30:00".to_string(),
            total_value: 100.50,
            digest_value: "ABC123==".to_string(),
            csc_id: "1".to_string(),
            csc: "123456".to_string(),
        }
    }

    #[test]
    fn test_generate_url() {
        let params = create_test_params();
        let url = QrCodeGenerator::generate_url(&params).unwrap();

        assert!(url.contains("chNFe=35260100123456780001906500100000000111234567890"));
        assert!(url.contains("tpAmb=2"));
        assert!(url.contains("cIdToken=000001"));
        assert!(url.contains("cHashQRCode="));
    }

    #[test]
    fn test_generate_hash_v2() {
        let params = create_test_params();
        let hash = QrCodeGenerator::generate_hash_v2(&params, "2").unwrap();

        // Hash deve ser hexadecimal de 40 caracteres (SHA1)
        assert_eq!(hash.len(), 40);
        assert!(hash.chars().all(|c| c.is_ascii_hexdigit()));
    }

    #[test]
    fn test_generate_svg() {
        let params = create_test_params();
        let svg = QrCodeGenerator::generate_svg(&params).unwrap();

        assert!(svg.contains("<svg"));
        assert!(svg.contains("</svg>"));
        assert!(svg.contains("200"));
    }

    #[test]
    fn test_generate_png() {
        let params = create_test_params();
        let png = QrCodeGenerator::generate_png(&params).unwrap();

        // PNG deve começar com assinatura PNG
        assert_eq!(&png[0..8], &[137, 80, 78, 71, 13, 10, 26, 10]);
    }

    #[test]
    fn test_get_base_url_sp_production() {
        let url = QrCodeGenerator::get_base_url("SP", 1).unwrap();
        assert!(url.contains("nfe.fazenda.sp.gov.br"));
    }

    #[test]
    fn test_get_base_url_sp_homologation() {
        let url = QrCodeGenerator::get_base_url("SP", 2).unwrap();
        assert!(url.contains("homologacao"));
    }
}
