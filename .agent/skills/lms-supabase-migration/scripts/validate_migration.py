import sys, re

def validate(filepath):
    try:
        content = open(filepath).read()
    except FileNotFoundError:
        print(f"ERROR: File not found: {filepath}"); sys.exit(1)

    errors = []

    # Rule 1: No ALTER TABLE on existing tables (whitelist new tables only)
    allowed_new_tables = ['activities', 'activity_submissions']
    for match in re.finditer(r'ALTER TABLE\s+(\w+)', content, re.IGNORECASE):
        tname = match.group(1).lower()
        if tname not in allowed_new_tables:
            errors.append(f"ERROR: ALTER TABLE on existing table '{tname}' — additive only rule violated.")

    # Rule 2: No DROP statements
    if re.search(r'\bDROP\b', content, re.IGNORECASE):
        if '-- INTENTIONAL DROP' not in content:
            errors.append("ERROR: DROP statement found. Add '-- INTENTIONAL DROP' if deliberate.")

    # Rule 3: All CREATE TABLE blocks need id PRIMARY KEY
    for match in re.finditer(r'CREATE TABLE\s+(?P<name>\w+)\s*\((?P<body>.*?)\);', content, re.DOTALL | re.IGNORECASE):
        name, body = match.group('name'), match.group('body')
        if not re.search(r'\bid\b.*PRIMARY KEY', body, re.IGNORECASE):
            errors.append(f"ERROR: Table '{name}' missing 'id' PRIMARY KEY.")

    # Rule 4: RLS must be enabled for every new table
    tables = re.findall(r'CREATE TABLE\s+(\w+)', content, re.IGNORECASE)
    for t in tables:
        if not re.search(rf'ENABLE ROW LEVEL SECURITY', content, re.IGNORECASE):
            errors.append(f"ERROR: RLS not enabled for table '{t}'.")

    # Rule 5: Rollback block must exist
    if '-- rollback:' not in content.lower():
        errors.append("ERROR: Missing '-- rollback:' section.")

    if errors:
        [print(e) for e in errors]; sys.exit(1)
    else:
        print("✅ Migration validation passed."); sys.exit(0)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python validate_migration.py <file.sql>"); sys.exit(1)
    validate(sys.argv[1])
