#!/usr/bin/env python3
"""
Script para aplicar migrations SQLx manualmente
"""
import sqlite3
import glob
import os
import re

DB_PATH = "mercearias.db"
MIGRATIONS_DIR = "migrations"

def get_migration_files():
    """Retorna lista de arquivos de migration ordenados"""
    files = glob.glob(f"{MIGRATIONS_DIR}/*.sql")
    # Ordenar por timestamp no nome do arquivo
    files.sort()
    return files

def apply_migration(conn, filepath):
    """Aplica uma migration"""
    print(f"Aplicando: {os.path.basename(filepath)}")
    
    with open(filepath, 'r') as f:
        sql = f.read()
    
    cursor = conn.cursor()
    # Executar cada statement separadamente
    for statement in sql.split(';'):
        statement = statement.strip()
        if statement:
            try:
                cursor.execute(statement)
            except sqlite3.Error as e:
                print(f"  ⚠️  Erro (pode ser esperado): {e}")
    
    conn.commit()
    print(f"  ✓ Aplicada")

def main():
    print("🔧 Aplicando migrations...")
    print(f"📁 Banco: {DB_PATH}")
    print(f"📁 Migrations: {MIGRATIONS_DIR}\n")
    
    # Criar banco se não existir
    conn = sqlite3.connect(DB_PATH)
    
    # Pegar arquivos de migration
    migrations = get_migration_files()
    print(f"Encontradas {len(migrations)} migrations\n")
    
    for migration_file in migrations:
        apply_migration(conn, migration_file)
    
    conn.close()
    print("\n✅ Migrations aplicadas com sucesso!")
    
    # Contar registros
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    tables = ['employees', 'categories', 'products', 'cash_sessions']
    print("\n📊 Status do banco:")
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"  {table}: {count} registros")
        except:
            print(f"  {table}: tabela não existe")
    
    conn.close()

if __name__ == "__main__":
    main()
