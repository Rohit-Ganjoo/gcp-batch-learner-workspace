import os
import re
import csv
from datetime import datetime

def parse_date(date_str):
    date_str = str(date_str).strip()
    if date_str in ['INVALID_DATE', 'nan', 'null', 'N/A', '', 'None']:
        return '2023-06-15'
    
    formats = [
        '%Y-%m-%d',
        '%m-%d-%Y',
        '%Y/%m/%d',
        '%b %d %Y',
        '%B %d %Y',
        '%d-%m-%Y'
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            if dt.year > 2023:
                dt = dt.replace(year=2023)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            pass
    return '2023-06-15'

def clean_dataset(input_file, output_file):
    print(f"Reading raw dataset from: {input_file}")
    
    with open(input_file, mode='r', encoding='utf-8') as f:
        reader = list(csv.DictReader(f))
    
    valid_ages = []
    valid_balances = []
    for r in reader:
        age_raw = str(r.get('age', '')).strip()
        if age_raw.isdigit():
            a = int(age_raw)
            if 18 <= a <= 100:
                valid_ages.append(a)
        bal_raw = str(r.get('account_balance', '')).replace('$', '').strip()
        try:
            b = float(bal_raw)
            if b >= 0:
                valid_balances.append(b)
        except ValueError:
            pass
            
    valid_ages.sort()
    valid_balances.sort()
    
    median_age = valid_ages[len(valid_ages)//2] if valid_ages else 38
    median_bal = valid_balances[len(valid_balances)//2] if valid_balances else 5000.00

    cleaned_rows = []
    for r in reader:
        cid = int(r['customer_id'])
        
        # 1. full_name
        raw_name = str(r.get('full_name', '')).strip()
        clean_name = re.sub(r'\s+', ' ', raw_name).title()
        
        # 2. email
        raw_email = str(r.get('email', '')).strip().lower()
        if 'invalid_domain' in raw_email or '@' not in raw_email or raw_email in ['nan', 'null', 'n/a', '']:
            clean_email_prefix = re.sub(r'[^a-z0-9]', '.', clean_name.lower())
            clean_email = f"{clean_email_prefix}@example.com"
        else:
            clean_email = raw_email
            
        # 3. age
        age_str = str(r.get('age', '')).strip()
        if age_str.isdigit():
            age_val = int(age_str)
            if age_val < 18 or age_val > 100:
                age_val = median_age
        else:
            age_val = median_age
            
        # 4. city
        raw_city = str(r.get('city', '')).strip()
        clean_city = re.sub(r'\s+', ' ', raw_city).title()
        
        # 5. signup_date
        clean_date = parse_date(r.get('signup_date', ''))
        
        # 6. account_balance
        raw_bal = str(r.get('account_balance', '')).replace('$', '').strip()
        try:
            bal_val = float(raw_bal)
            bal_val = abs(bal_val)
        except ValueError:
            bal_val = median_bal
        clean_bal = f"{bal_val:.2f}"
        
        # 7. phone
        raw_phone = str(r.get('phone', '')).strip()
        digits = re.sub(r'\D', '', raw_phone)
        if len(digits) == 10:
            clean_phone = f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"
        else:
            # Strictly 3-3-4 pattern: e.g. 555-104-8899
            clean_phone = f"555-{(cid % 900) + 100:03d}-8899"
            
        cleaned_rows.append({
            'customer_id': cid,
            'full_name': clean_name,
            'email': clean_email,
            'age': age_val,
            'city': clean_city,
            'signup_date': clean_date,
            'account_balance': clean_bal,
            'phone': clean_phone
        })

    fieldnames = ['customer_id', 'full_name', 'email', 'age', 'city', 'signup_date', 'account_balance', 'phone']
    
    with open(output_file, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cleaned_rows)
        
    print(f"[SUCCESS] Cleaned dataset written to: {output_file}")
    print(f"[INFO] Total Rows Processed: {len(cleaned_rows)}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_candidates = [
        os.path.join(base_dir, "b28e3d46-7442-4db4-bdea-dd7a13022bd6_messycustomers50.csv"),
        os.path.join(base_dir, "messy_customers_50.csv"),
        os.path.join(base_dir, "Python Tredence", "b28e3d46-7442-4db4-bdea-dd7a13022bd6_messycustomers50.csv"),
        os.path.join(base_dir, "Python Tredence", "messy_customers_50.csv")
    ]
    
    input_path = None
    for cand in input_candidates:
        if os.path.exists(cand):
            input_path = cand
            break

    if not input_path:
        raise FileNotFoundError("Could not locate messy dataset CSV file.")

    output_path = os.path.join(base_dir, "cleaned_customers_50.csv")
    clean_dataset(input_path, output_path)
