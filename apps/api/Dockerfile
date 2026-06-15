FROM gradle:9.4.1-jdk25-alpine AS build

WORKDIR /app
COPY build.gradle settings.gradle ./

COPY src ./src
RUN gradle build

FROM eclipse-temurin:25-jre-alpine

RUN addgroup -S app && adduser -S app -G app

COPY --from=build /app/build/libs/api-1.0.jar api.jar

USER app

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "api.jar"]
