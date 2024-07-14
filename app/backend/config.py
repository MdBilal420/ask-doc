from pydantic_settings import BaseSettings
import boto3

class Settings(BaseSettings):
    DATABASE_HOST: str
    DATABASE_NAME: str
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_PORT: int
    app_name: str = "Gen App"
    AWS_KEY: str
    AWS_SECRET: str
    AWS_S3_BUCKET: str
    AWS_REGION: str = "us-west-2"

    @classmethod
    def get_s3_client(cls):
        settings = cls()
        return boto3.client(
            's3',
            aws_access_key_id=settings.AWS_KEY,
            aws_secret_access_key=settings.AWS_SECRET,
            region_name=settings.AWS_REGION
        )

    class Config:
        env_file = ".env"
        extra = "ignore"