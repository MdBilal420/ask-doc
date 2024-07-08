from sqlalchemy.orm import Session
import models, schemas

def create_doc(db: Session, doc: schemas.DocRequest):
    db_doc = models.Doc(name=doc.name, read=doc.read)
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

def read_docs(db: Session, read: bool):
    if read is None:
        temp = db.query(models.Doc).all()
        print("temp",temp)
        return temp
    else:
        return db.query(models.Doc).filter(models.Doc.read == read).all()

def read_doc(db: Session, id: int):
    return db.query(models.Doc).filter(models.Doc.id == id).first()

def update_doc(db: Session, id: int, doc: schemas.DocRequest):
    db_doc = db.query(models.Doc).filter(models.Doc.id == id).first()
    if db_doc is None:
        return None
    db.query(models.Doc).filter(models.Doc.id == id).update({'name': doc.name, 'read': doc.read})
    db.commit()
    db.refresh(db_doc)
    return db_doc

def delete_doc(db: Session, id: int):
    db_doc = db.query(models.Doc).filter(models.Doc.id == id).first()
    if db_doc is None:
        return None
    db.query(models.Doc).filter(models.Doc.id == id).delete()
    db.commit()
    return True