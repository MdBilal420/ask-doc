from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
import schemas
import crud
from database import SessionLocal

router = APIRouter(
    prefix="/docs"
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", status_code=status.HTTP_201_CREATED)
def create_doc(doc: schemas.DocRequest, db: Session = Depends(get_db)):
    doc = crud.create_doc(db, doc)
    return doc

@router.get("", response_model=List[schemas.DocResponse])
def get_docs(completed: bool = None, db: Session = Depends(get_db)):
    docs = crud.read_docs(db, completed)
    return docs

@router.get("/{id}")
def get_doc_by_id(id: int, db: Session = Depends(get_db)):
    doc = crud.read_doc(db, id)
    if doc is None:
        raise HTTPException(status_code=404, detail="to do not found")
    return doc

@router.put("/{id}")
def update_doc(id: int, doc: schemas.DocRequest, db: Session = Depends(get_db)):
    doc = crud.update_doc(db, id, doc)
    if doc is None:
        raise HTTPException(status_code=404, detail="to do not found")
    return doc

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_doc(id: int, db: Session = Depends(get_db)):
    res = crud.delete_doc(db, id)
    if res is None:
        raise HTTPException(status_code=404, detail="to do not found")