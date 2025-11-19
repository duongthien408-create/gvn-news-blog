.PHONY: help run build seed clean install test

help:
	@echo "GearVN Blog Backend - Available Commands:"
	@echo ""
	@echo "  make install    - Install dependencies"
	@echo "  make run        - Run the server"
	@echo "  make build      - Build the binary"
	@echo "  make seed       - Seed database with sample data"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make test       - Run tests"
	@echo ""

install:
	@echo "📦 Installing dependencies..."
	go mod download
	@echo "✅ Dependencies installed!"

run:
	@echo "🚀 Starting server..."
	go run .

build:
	@echo "🔨 Building server..."
	go build -o bin/server .
	@echo "✅ Build complete! Binary: ./bin/server"

seed:
	@echo "🌱 Seeding database..."
	go run . --seed

clean:
	@echo "🧹 Cleaning..."
	rm -rf bin/
	@echo "✅ Clean complete!"

test:
	@echo "🧪 Running tests..."
	go test -v ./...
