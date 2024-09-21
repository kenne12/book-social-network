docker build -f docker/frontend/Dockerfile -t kennegervais/bsn-ui:latest ./book-network-ui
docker build -f docker/backend/Dockerfile -t kennegervais/bsn-api:latest ./book-network-api