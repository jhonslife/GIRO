/**
 * @file validators.test.ts - Testes para funções de validação
 */

import { validateCNPJ, validateCPF, validateEAN13, validateEmail } from '@/lib/validators';
import { describe, expect, it } from 'vitest';

describe('Validators', () => {
  describe('validateEAN13', () => {
    it('should validate correct EAN-13', () => {
      expect(validateEAN13('7891234567895')).toBe(true);
      expect(validateEAN13('7898357410015')).toBe(true);
    });

    it('should reject invalid EAN-13', () => {
      expect(validateEAN13('1234567890123')).toBe(false);
      expect(validateEAN13('7891234567891')).toBe(false);
    });

    it('should reject wrong length', () => {
      expect(validateEAN13('123456789012')).toBe(false);
      expect(validateEAN13('12345678901234')).toBe(false);
    });

    it('should reject non-numeric', () => {
      expect(validateEAN13('789123456789A')).toBe(false);
      expect(validateEAN13('')).toBe(false);
    });
  });

  describe('validateCPF', () => {
    it('should validate correct CPF', () => {
      expect(validateCPF('529.982.247-25')).toBe(true);
      expect(validateCPF('52998224725')).toBe(true);
    });

    it('should reject invalid CPF', () => {
      expect(validateCPF('111.111.111-11')).toBe(false);
      expect(validateCPF('123.456.789-00')).toBe(false);
    });

    it('should reject wrong format', () => {
      expect(validateCPF('')).toBe(false);
      expect(validateCPF('12345678')).toBe(false);
    });
  });

  describe('validateCNPJ', () => {
    it('should validate correct CNPJ', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
      expect(validateCNPJ('11222333000181')).toBe(true);
    });

    it('should reject invalid CNPJ', () => {
      expect(validateCNPJ('11.111.111/1111-11')).toBe(false);
      expect(validateCNPJ('00.000.000/0000-00')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.com.br')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });
});
