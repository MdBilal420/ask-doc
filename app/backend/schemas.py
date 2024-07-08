from pydantic import BaseModel

class DocRequest(BaseModel):
    name: str
    read: bool

class DocResponse(BaseModel):
    name: str
    read: bool
    id: int

    class Config:
        orm_mode = True