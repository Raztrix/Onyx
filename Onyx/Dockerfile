# 1. Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
RUN mkdir -p wwwroot

# 2. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# COPY the project file (Now we just say the filename, no folder prefix)
COPY ["Onyx.csproj", "./"]
RUN dotnet restore "Onyx.csproj"

# COPY everything else
COPY . .

# Build
RUN dotnet build "Onyx.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "Onyx.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final Stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Onyx.dll"]