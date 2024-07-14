from pydantic import BaseModel
from typing import Optional

class DocRequest(BaseModel):
    name: str
    read: bool

class DocResponse(BaseModel):
    name: str
    read: bool
    id: int

class PDFRequest(BaseModel):
    name: str
    selected: bool
    file: str

class PDFResponse(BaseModel):
    id: int
    name: str
    selected: bool
    file: str

    class Config:
        from_attributes = True