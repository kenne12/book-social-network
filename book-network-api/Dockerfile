FROM maven:3.9.3 AS build
WORKDIR /app
#COPY pom.xml /app
COPY . /app
RUN mvn dependency:resolve
#COPY . /app
RUN mvn clean
RUN mvn package -DskipTests=true

#FROM openjdk:17.0
FROM eclipse-temurin:17-jdk-alpine
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8088
CMD ["java", "-jar", "app.jar"]