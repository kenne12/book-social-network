# Build stage
FROM maven:3.8.7-openjdk-18 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:17

ARG PROFILE=prod
ARG APP_VERSION=1.0.0
ARG BSN_DATABASE_URL=jdbc:postgresql://192.168.1.10:5435/book_social_network

WORKDIR /app
COPY --from=build /build/target/book-network-*.jar /app/

EXPOSE 8088

ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}
ENV BD_URL=${BSN_DATABASE_URL}

CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} book-network-${JAR_VERSION}.jar
#CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${BD_URL} book-network-${JAR_VERSION}.jar