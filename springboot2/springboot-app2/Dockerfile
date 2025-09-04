# ===== 1) Gradle로 빌드 =====
FROM gradle:7.6.1-jdk17 AS build
WORKDIR /app2
COPY . .
RUN gradle bootJar

# ===== 2) 런타임 이미지 =====
FROM openjdk:17-jdk-slim
WORKDIR /app2
COPY --from=build /app2/build/libs/*.jar app2.jar
ENTRYPOINT ["java","-jar","/app2/app2.jar"]
