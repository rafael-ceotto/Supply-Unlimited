FROM python:3.13-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    postgresql-client \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . .

# Copy entrypoint script
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
# Ensure entrypoint has Unix line endings (in case repo checked out with CRLF on Windows)
RUN sed -i 's/\r$//' /entrypoint.sh || true

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Run entrypoint script via shell (avoids shebang/CRLF issues)
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
