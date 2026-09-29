# ============================================================
# ASSIGNMENT 3 - INDIAN TELECOM SUBSCRIBER DATA ANALYSIS
# Dataset: Table_3.1.csv
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
import os

# ------------------------------------------------------------
# 1. LOAD DATASET
# ------------------------------------------------------------

FILE = "Table_3.1.csv"

if not os.path.exists(FILE):
    raise FileNotFoundError(
        f"Could not find {FILE}. Put the CSV in the same folder as this Python file."
    )

df = pd.read_csv(FILE)

print("\n" + "=" * 70)
print("1. DATASET INFORMATION")
print("=" * 70)

print("Dataset shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())

print("\nData types:")
print(df.dtypes)

# ------------------------------------------------------------
# 2. MISSING VALUES
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("2. MISSING VALUE ANALYSIS")
print("=" * 70)

missing = df.isnull().sum()
print(missing)

print("\nTotal missing values:", df.isnull().sum().sum())

# ------------------------------------------------------------
# 3. SELECT OVERALL INDIA RECORDS
# ------------------------------------------------------------

# Your dataset contains a row identifying the overall service-area totals.
# Find it safely rather than assuming exact capitalization.

location_col = None

for col in df.columns:
    if "State" in col or "overall" in col.lower():
        location_col = col
        break

if location_col is None:
    raise ValueError(
        "Could not identify the State/overall column."
    )

overall = df[
    df[location_col]
    .astype(str)
    .str.contains("Overall", case=False, na=False)
].copy()

# If no "Overall" row is found, stop with useful information.
if overall.empty:
    print("\nAvailable values in", location_col)
    print(df[location_col].unique())
    raise ValueError("No Overall India/service-area record found.")

print("\nOverall records found:", len(overall))

# ------------------------------------------------------------
# 4. IDENTIFY YEAR COLUMN
# ------------------------------------------------------------

year_col = None

for col in df.columns:
    if "March" in col:
        year_col = col
        break

if year_col is None:
    # fallback
    for col in df.columns:
        if "year" in col.lower():
            year_col = col
            break

if year_col is None:
    raise ValueError("Could not identify the year column.")

overall["Year"] = pd.to_numeric(
    overall[year_col], errors="coerce"
)

# ------------------------------------------------------------
# 5. CONVERT NUMERIC COLUMNS
# ------------------------------------------------------------

possible_numeric = [
    "Total",
    "Wireless",
    "Wireline",
    "Rural",
    "Urban",
    "Private",
    "Public"
]

for col in possible_numeric:
    if col in overall.columns:
        overall[col] = pd.to_numeric(
            overall[col], errors="coerce"
        )

overall = overall.sort_values("Year").reset_index(drop=True)

print("\n" + "=" * 70)
print("3. CLEANED OVERALL DATA")
print("=" * 70)

print(
    overall[
        [c for c in ["Year", "Total", "Wireless", "Wireline",
                     "Rural", "Urban", "Private", "Public"]
         if c in overall.columns]
    ].to_string(index=False)
)

# ------------------------------------------------------------
# 6. DESCRIPTIVE STATISTICS
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("4. DESCRIPTIVE STATISTICS")
print("=" * 70)

numeric_cols = [
    c for c in [
        "Total",
        "Wireless",
        "Wireline",
        "Rural",
        "Urban",
        "Private",
        "Public"
    ]
    if c in overall.columns
]

for col in numeric_cols:

    series = overall[col].dropna()

    print(f"\n--- {col} ---")

    print("Count            :", len(series))
    print("Mean             :", round(series.mean(), 2))
    print("Median           :", round(series.median(), 2))

    mode = series.mode()

    if len(mode) > 0:
        print("Mode             :", mode.iloc[0])
    else:
        print("Mode             : No mode")

    print("Variance         :", round(series.var(), 2))
    print("Std Deviation    :", round(series.std(), 2))
    print("Minimum          :", round(series.min(), 2))
    print("Maximum          :", round(series.max(), 2))
    print("Range            :", round(series.max() - series.min(), 2))
    print("Q1               :", round(series.quantile(0.25), 2))
    print("Q3               :", round(series.quantile(0.75), 2))
    print("IQR              :", round(
        series.quantile(0.75) - series.quantile(0.25), 2
    ))

    if series.mean() != 0:
        cv = (series.std() / series.mean()) * 100
        print("Coefficient Var. :", round(cv, 2), "%")

# ------------------------------------------------------------
# 7. YEAR-OVER-YEAR GROWTH
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("5. YEAR-OVER-YEAR GROWTH")
print("=" * 70)

overall["YoY Growth %"] = (
    overall["Total"].pct_change() * 100
)

print(
    overall[
        ["Year", "Total", "YoY Growth %"]
    ].to_string(index=False)
)

max_growth_idx = overall["YoY Growth %"].idxmax()
min_growth_idx = overall["YoY Growth %"].idxmin()

print(
    "\nHighest growth:",
    round(overall.loc[max_growth_idx, "YoY Growth %"], 2),
    "% in",
    int(overall.loc[max_growth_idx, "Year"])
)

print(
    "Largest decline:",
    round(overall.loc[min_growth_idx, "YoY Growth %"], 2),
    "% in",
    int(overall.loc[min_growth_idx, "Year"])
)

# ------------------------------------------------------------
# 8. CAGR
# ------------------------------------------------------------

first_year = overall.iloc[0]["Year"]
last_year = overall.iloc[-1]["Year"]

first_total = overall.iloc[0]["Total"]
last_total = overall.iloc[-1]["Total"]

number_of_years = last_year - first_year

if first_total > 0 and number_of_years > 0:

    cagr = (
        (last_total / first_total)
        ** (1 / number_of_years)
        - 1
    ) * 100

    print("\n" + "=" * 70)
    print("6. CAGR")
    print("=" * 70)

    print("Start year       :", int(first_year))
    print("End year         :", int(last_year))
    print("Start subscribers:", round(first_total, 2))
    print("End subscribers  :", round(last_total, 2))
    print("CAGR             :", round(cagr, 2), "%")

# ------------------------------------------------------------
# 9. WIRELESS VS WIRELINE
# ------------------------------------------------------------

if "Wireless" in overall.columns and "Wireline" in overall.columns:

    print("\n" + "=" * 70)
    print("7. WIRELESS VS WIRELINE")
    print("=" * 70)

    overall["Wireless Share %"] = (
        overall["Wireless"] /
        overall["Total"] * 100
    )

    overall["Wireline Share %"] = (
        overall["Wireline"] /
        overall["Total"] * 100
    )

    print(
        overall[
            [
                "Year",
                "Wireless",
                "Wireline",
                "Wireless Share %",
                "Wireline Share %"
            ]
        ].to_string(index=False)
    )

    print(
        "\nAverage Wireless:",
        round(overall["Wireless"].mean(), 2)
    )

    print(
        "Average Wireline:",
        round(overall["Wireline"].mean(), 2)
    )

# ------------------------------------------------------------
# 10. RURAL VS URBAN
# ------------------------------------------------------------

if "Rural" in overall.columns and "Urban" in overall.columns:

    print("\n" + "=" * 70)
    print("8. RURAL VS URBAN")
    print("=" * 70)

    overall["Rural Share %"] = (
        overall["Rural"] /
        overall["Total"] * 100
    )

    overall["Urban Share %"] = (
        overall["Urban"] /
        overall["Total"] * 100
    )

    print(
        overall[
            [
                "Year",
                "Rural",
                "Urban",
                "Rural Share %",
                "Urban Share %"
            ]
        ].to_string(index=False)
    )

    print(
        "\nAverage Rural:",
        round(overall["Rural"].mean(), 2)
    )

    print(
        "Average Urban:",
        round(overall["Urban"].mean(), 2)
    )

# ------------------------------------------------------------
# 11. CORRELATION
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("9. PEARSON CORRELATION")
print("=" * 70)

correlation_results = []

for col in numeric_cols:

    if col == "Total":
        continue

    temp = overall[["Year", col]].dropna()

    if len(temp) >= 3:

        r, p = stats.pearsonr(
            temp["Year"],
            temp[col]
        )

        correlation_results.append(
            [col, r, p]
        )

        print(
            f"{col:12s}  r = {r:.4f}   p = {p:.6f}"
        )

print("\nInterpretation:")
print("r close to +1  -> strong positive association")
print("r close to -1  -> strong negative association")
print("r close to  0  -> weak/no linear association")

# ------------------------------------------------------------
# 12. REGRESSION: YEAR VS TOTAL
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("10. LINEAR REGRESSION")
print("=" * 70)

reg_data = overall[
    ["Year", "Total"]
].dropna()

slope, intercept, r_value, p_value, std_err = stats.linregress(
    reg_data["Year"],
    reg_data["Total"]
)

r_squared = r_value ** 2

print("Slope             :", round(slope, 4))
print("Intercept         :", round(intercept, 4))
print("Correlation (r)   :", round(r_value, 4))
print("R-squared         :", round(r_squared, 4))
print("R-squared (%)     :", round(r_squared * 100, 2), "%")
print("p-value           :", p_value)
print("Standard error    :", round(std_err, 4))

print(
    f"\nRegression equation:"
    f"\nTotal = {intercept:.2f} + ({slope:.2f} × Year)"
)

# ------------------------------------------------------------
# 13. T-TEST: RURAL VS URBAN
# ------------------------------------------------------------

if "Rural" in overall.columns and "Urban" in overall.columns:

    print("\n" + "=" * 70)
    print("11. INDEPENDENT T-TEST: RURAL VS URBAN")
    print("=" * 70)

    rural = overall["Rural"].dropna()
    urban = overall["Urban"].dropna()

    t_stat, t_p = stats.ttest_ind(
        rural,
        urban,
        equal_var=False
    )

    print("Rural mean:", round(rural.mean(), 2))
    print("Urban mean:", round(urban.mean(), 2))
    print("t-statistic:", round(t_stat, 4))
    print("p-value:", t_p)

    if t_p < 0.05:
        print(
            "Result: Statistically significant difference "
            "between rural and urban subscriber values."
        )
    else:
        print(
            "Result: No statistically significant difference "
            "at the 5% significance level."
        )

# ------------------------------------------------------------
# 14. ANOVA
# ------------------------------------------------------------

anova_columns = [
    c for c in [
        "Wireless",
        "Wireline",
        "Rural",
        "Urban",
        "Private",
        "Public"
    ]
    if c in overall.columns
]

if len(anova_columns) >= 3:

    print("\n" + "=" * 70)
    print("12. ONE-WAY ANOVA")
    print("=" * 70)

    groups = [
        overall[col].dropna()
        for col in anova_columns
    ]

    f_stat, f_p = stats.f_oneway(*groups)

    print("Groups:", anova_columns)
    print("F-statistic:", round(f_stat, 4))
    print("p-value:", f_p)

    if f_p < 0.05:
        print(
            "Result: There is a statistically significant "
            "difference among the group means."
        )
    else:
        print(
            "Result: No statistically significant difference "
            "among the group means at 5% significance."
        )

# ------------------------------------------------------------
# 15. CORRELATION MATRIX
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("13. CORRELATION MATRIX")
print("=" * 70)

corr_matrix = overall[numeric_cols].corr()

print(
    corr_matrix.round(3)
)

# ------------------------------------------------------------
# 16. GRAPH 1 - TOTAL SUBSCRIBERS
# ------------------------------------------------------------

plt.figure(figsize=(10, 6))

plt.plot(
    overall["Year"],
    overall["Total"],
    marker="o"
)

plt.title(
    "Total Telecom Subscribers in India (2008–2022)"
)

plt.xlabel("Year")
plt.ylabel("Subscribers (Millions)")

plt.grid(True)
plt.tight_layout()
plt.show()

# ------------------------------------------------------------
# 17. GRAPH 2 - WIRELESS VS WIRELINE
# ------------------------------------------------------------

if "Wireless" in overall.columns and "Wireline" in overall.columns:

    plt.figure(figsize=(10, 6))

    plt.plot(
        overall["Year"],
        overall["Wireless"],
        marker="o",
        label="Wireless"
    )

    plt.plot(
        overall["Year"],
        overall["Wireline"],
        marker="o",
        label="Wireline"
    )

    plt.title(
        "Wireless vs Wireline Subscribers"
    )

    plt.xlabel("Year")
    plt.ylabel("Subscribers (Millions)")

    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

# ------------------------------------------------------------
# 18. GRAPH 3 - RURAL VS URBAN
# ------------------------------------------------------------

if "Rural" in overall.columns and "Urban" in overall.columns:

    plt.figure(figsize=(10, 6))

    plt.plot(
        overall["Year"],
        overall["Rural"],
        marker="o",
        label="Rural"
    )

    plt.plot(
        overall["Year"],
        overall["Urban"],
        marker="o",
        label="Urban"
    )

    plt.title(
        "Rural vs Urban Telecom Subscribers"
    )

    plt.xlabel("Year")
    plt.ylabel("Subscribers (Millions)")

    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

# ------------------------------------------------------------
# 19. GRAPH 4 - YOY GROWTH
# ------------------------------------------------------------

plt.figure(figsize=(10, 6))

plt.bar(
    overall["Year"],
    overall["YoY Growth %"]
)

plt.axhline(
    y=0,
    linewidth=1
)

plt.title(
    "Year-over-Year Growth in Total Subscribers"
)

plt.xlabel("Year")
plt.ylabel("Growth (%)")

plt.grid(axis="y")
plt.tight_layout()
plt.show()

# ------------------------------------------------------------
# 20. GRAPH 5 - REGRESSION
# ------------------------------------------------------------

plt.figure(figsize=(10, 6))

plt.scatter(
    reg_data["Year"],
    reg_data["Total"]
)

predicted = (
    intercept +
    slope * reg_data["Year"]
)

plt.plot(
    reg_data["Year"],
    predicted,
    linewidth=2
)

plt.title(
    "Linear Regression: Year vs Total Subscribers"
)

plt.xlabel("Year")
plt.ylabel("Total Subscribers (Millions)")

plt.grid(True)
plt.tight_layout()
plt.show()

# ------------------------------------------------------------
# 21. SAVE ANALYZED DATA
# ------------------------------------------------------------

OUTPUT_FILE = "Telecom_Assignment3_Analyzed.csv"

overall.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\n" + "=" * 70)
print("14. ANALYSIS COMPLETED")
print("=" * 70)

print(
    f"Analyzed dataset saved as: {OUTPUT_FILE}"
)

print("\nKey findings:")

print(
    f"• Total subscribers increased from "
    f"{first_total:.2f} M to {last_total:.2f} M."
)

print(
    f"• CAGR = {cagr:.2f}%."
)

print(
    f"• Year vs Total correlation = {r_value:.4f}."
)

print(
    f"• Regression R² = {r_squared:.4f} "
    f"({r_squared * 100:.2f}%)."
)

print(
    f"• Highest YoY growth = "
    f"{overall.loc[max_growth_idx, 'YoY Growth %']:.2f}% "
    f"in {int(overall.loc[max_growth_idx, 'Year'])}."
)

print(
    f"• Largest YoY decline = "
    f"{overall.loc[min_growth_idx, 'YoY Growth %']:.2f}% "
    f"in {int(overall.loc[min_growth_idx, 'Year'])}."
)

print("\nDone.")