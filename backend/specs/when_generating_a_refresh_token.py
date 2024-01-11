from datetime import datetime, timedelta

from jose import jwt

from settings import ALGORITHM, REFRESH_SECRET_KEY
from auth import create_refresh_token


class DescribeAuthorization:
    def should_create_refresh_token(self):
        subject = "example-user"
        expires_delta = timedelta(days=1)

        generated_token = create_refresh_token(subject, expires_delta)

        # Ensure the generated token is not empty
        assert generated_token is not None

        # Ensure the generated token can be successfully decoded
        # try:
        decoded_token = jwt.decode(
            generated_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM]
        )
        assert decoded_token["sub"] == subject
