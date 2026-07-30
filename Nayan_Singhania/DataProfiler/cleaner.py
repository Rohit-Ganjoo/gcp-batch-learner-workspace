import re
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from io import StringIO
from datetime import date

import pandas as pd


COLUMNS = [
    "customer_id",
    "full_name",
    "email",
    "age",
    "city",
    "signup_date",
    "account_balance",
    "phone",
]


def clean_text_columns(df):
    df["full_name"] = df["full_name"].astype(str).str.strip().str.title()
    df["city"] = df["city"].astype(str).str.strip().str.title()
    return df


def clean_emails(df):
    df["email"] = df["email"].astype(str).str.strip().str.lower()
    most_common_domain = get_most_common_domain(df)

    df["email"] = [
        fix_email(email, name, most_common_domain)
        for email, name in zip(df["email"], df["full_name"])
    ]
    return df


def get_most_common_domain(df):
    domains = []

    for email in df["email"].astype(str).str.strip().str.lower():
        if "@" not in email:
            continue

        domain = email.split("@")[-1]
        if domain != "invalid_domain" and re.match(r"^[a-z0-9.-]+\.[a-z]{2,}$", domain):
            domains.append(domain)

    if not domains:
        return "example.com"

    return pd.Series(domains).value_counts().idxmax()


def fix_email(email, name, domain):
    email = str(email).strip().lower()

    if "@" in email:
        local_part = email.split("@")[0]
        current_domain = email.split("@")[-1]
    else:
        local_part = str(name).strip().lower()
        current_domain = ""

    local_part = re.sub(r"[^a-z0-9]+", ".", local_part).strip(".")
    if local_part == "":
        local_part = "customer"

    if current_domain != "invalid_domain" and re.match(r"^[a-z0-9.-]+\.[a-z]{2,}$", current_domain):
        return f"{local_part}@{current_domain}"

    return f"{local_part}@{domain}"


def clean_ages(df):
    ages = pd.to_numeric(df["age"], errors="coerce")
    ages = ages.where((ages >= 18) & (ages <= 100))
    df["age"] = ages.apply(lambda value: str(int(value)) if pd.notna(value) else "N/A")
    return df


def clean_dates(df):
    dates = df["signup_date"].apply(lambda value: pd.to_datetime(value, errors="coerce"))
    today = pd.Timestamp(date.today())

    dates = dates.mask(dates > today, today)
    df["signup_date"] = dates.dt.strftime("%Y-%m-%d").fillna("N/A")
    return df


def clean_balances(df):
    balances = df["account_balance"].astype(str).str.replace("$", "", regex=False)
    balances = balances.str.replace(",", "", regex=False)
    balances = pd.to_numeric(balances, errors="coerce").fillna(0).abs()

    df["account_balance"] = balances
    return df


def clean_phones(df):
    df["phone"] = [
        format_phone(phone, customer_id)
        for phone, customer_id in zip(df["phone"], df["customer_id"])
    ]
    return df


def format_phone(phone, customer_id):
    digits = re.sub(r"\D", "", str(phone))

    if len(digits) == 10 and digits[0] not in "01" and digits[3] not in "01":
        return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"

    return "N/A"


def clean_dataset(df):
    df = df[COLUMNS].copy()
    df = clean_text_columns(df)
    df = clean_emails(df)
    df = clean_ages(df)
    df = clean_dates(df)
    df = clean_balances(df)
    df = clean_phones(df)
    return df


def clean_csv_text(csv_text):
    df = pd.read_csv(StringIO(csv_text), dtype=str, keep_default_na=False)
    cleaned_df = clean_dataset(df)
    output = StringIO()
    cleaned_df.to_csv(output, index=False, float_format="%.2f")
    return output.getvalue()


class CleanerHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.send_file("index.html", "text/html; charset=utf-8")
        else:
            self.send_error(404, "Not found")

    def do_POST(self):
        if self.path != "/clean":
            self.send_error(404, "Not found")
            return

        length = int(self.headers.get("Content-Length", 0))
        csv_text = self.rfile.read(length).decode("utf-8")

        try:
            cleaned_csv = clean_csv_text(csv_text)
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(cleaned_csv.encode("utf-8"))
        except Exception as error:
            self.send_response(400)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(str(error).encode("utf-8"))

    def send_file(self, filename, content_type):
        with open(filename, "rb") as file:
            content = file.read()

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(content)


def run_server():
    server = ThreadingHTTPServer(("localhost", 8000), CleanerHandler)
    print("Data Profiler running at http://localhost:8000")
    print("Press Ctrl+C to stop the server.")
    server.serve_forever()


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "serve":
        run_server()
        return

    input_file = sys.argv[1] if len(sys.argv) > 1 else "messy_customers50.csv"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "clean_customers50.csv"

    df = pd.read_csv(input_file, dtype=str, keep_default_na=False)
    cleaned_df = clean_dataset(df)
    cleaned_df.to_csv(output_file, index=False, float_format="%.2f")

    print(f"Cleaned dataset saved as {output_file}")


if __name__ == "__main__":
    main()
