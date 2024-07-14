from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class Doc(Base):
    __tablename__ = "docs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    read = Column(Boolean, default=False)

class PDF(Base):
    __tablename__ = "pdfs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text)
    file = Column(Text)
    selected = Column(Boolean, default=False)