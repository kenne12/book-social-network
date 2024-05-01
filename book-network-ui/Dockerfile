FROM node:latest as build

# set the workind directory
WORKDIR /usr/local/app

# add the source code to app
COPY ./ /usr/local/app

# Install all dependencies
RUN npm install

# Generate the build
RUN npm run build


# Stage 2: Serve app with nginx server

#Use official nginx image
FROM nginx:latest

# Copy the build output to replace the default nginx content.
COPY --from=build /usr/local/app/dist/book-network-ui/browser /usr/share/nginx/html

EXPOSE 80
