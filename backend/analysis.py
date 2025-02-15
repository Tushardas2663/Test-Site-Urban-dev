import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima.model import ARIMA
import plotly.express as px

# Load data from Excel file
file_path = "data.xlsx"
sheets = ["product", "customer", "market", "date", "transaction"]

# Read sheets
product_df = pd.read_excel(file_path, sheet_name="product")
customer_df = pd.read_excel(file_path, sheet_name="customer")
market_df = pd.read_excel(file_path, sheet_name="market")
date_df = pd.read_excel(file_path, sheet_name="date", parse_dates=["date"])
transaction_df = pd.read_excel(file_path, sheet_name="transaction", parse_dates=["order_date"])

# Merge DataFrames
df = transaction_df.merge(product_df, on="product_code", how="left") \
                   .merge(customer_df, on="customer_code", how="left") \
                   .merge(market_df, on="market_code", how="left") \
                   .merge(date_df, left_on="order_date", right_on="date", how="left")

# Drop redundant columns
df.drop(columns=["date"], inplace=True)

# Handle missing and negative sales values
df["sales_amount"] = df["sales_amount"].apply(lambda x: np.nan if x < 0 else x)
df.dropna(inplace=True)

# Convert date columns to datetime
df["order_date"] = pd.to_datetime(df["order_date"])
df.sort_values(by="order_date", inplace=True)

print("✅ Data loaded and cleaned.")

# ---- Time Series Analysis ----
sales_trend = df.groupby(["year", "month_name"])["sales_amount"].sum().reset_index()
sales_trend["date"] = pd.to_datetime(sales_trend["year"].astype(str) + "-" + sales_trend["month_name"], format="%Y-%B")

# Decomposing Time Series
result = seasonal_decompose(sales_trend.set_index("date")["sales_amount"], model="additive", period=12)
result.plot()
plt.show()

# ARIMA Model for Forecasting
model = ARIMA(sales_trend.set_index("date")["sales_amount"], order=(5,1,0))
arima_fit = model.fit()
forecast = arima_fit.forecast(steps=6)

# Plot forecast
plt.figure(figsize=(10,5))
plt.plot(sales_trend["date"], sales_trend["sales_amount"], label="Actual Sales")
plt.plot(pd.date_range(sales_trend["date"].max(), periods=6, freq='M'), forecast, label="Forecast", linestyle="dashed")
plt.legend()
plt.title("Sales Trend Forecasting")
plt.show()

print("📊 Time series analysis completed.")

# ---- Anomaly Detection in Sales ----
iso_forest = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
df["anomaly_score"] = iso_forest.fit_predict(df[["sales_amount"]])
df["is_anomaly"] = df["anomaly_score"] == -1

# Plot anomalies
plt.figure(figsize=(10,5))
sns.scatterplot(data=df, x="order_date", y="sales_amount", hue="is_anomaly", palette={True: "red", False: "blue"})
plt.title("Anomaly Detection in Sales")
plt.show()

print("🚨 Anomaly detection completed.")

# ---- Customer Segmentation ----
customer_sales = df.groupby("customer_code")["sales_amount"].sum().reset_index()

# K-Means Clustering
kmeans = KMeans(n_clusters=3, random_state=42)
customer_sales["cluster"] = kmeans.fit_predict(customer_sales[["sales_amount"]])

# Visualize customer segments
plt.figure(figsize=(8,5))
sns.scatterplot(data=customer_sales, x="customer_code", y="sales_amount", hue="cluster", palette="viridis")
plt.xticks(rotation=90)
plt.title("Customer Segmentation using K-Means")
plt.show()

print("🛒 Customer segmentation completed.")

# ---- Automated Data Processing & Reporting ----
def generate_report():
    report = df.groupby(["year", "month_name"])["sales_amount"].sum().reset_index()
    report.to_csv("monthly_sales_report.csv", index=False)
    print("📄 Report saved: monthly_sales_report.csv")

generate_report()

# ---- Interactive Dashboard with Plotly ----
fig = px.line(sales_trend, x="date", y="sales_amount", title="Sales Trend Over Time")
fig.show()

print("📈 Dashboard generated.")
