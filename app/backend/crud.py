from sqlalchemy.orm import Session
import models, schemas
from fastapi import UploadFile, HTTPException
from config import Settings
from botocore.exceptions import NoCredentialsError,ClientError, BotoCoreError
import logging


def create_pdf(db: Session, pdf: schemas.PDFRequest):
    db_pdf = models.PDF(name=pdf.name, selected=pdf.selected, file=pdf.file)
    db.add(db_pdf)
    db.commit()
    db.refresh(db_pdf)
    return db_pdf

def read_pdfs(db: Session, selected: bool = None):
    if selected is None:
        return db.query(models.PDF).all()
    else:
        return db.query(models.PDF).filter(models.PDF.selected == selected).all()

def read_pdf(db: Session, id: int):
    return db.query(models.PDF).filter(models.PDF.id == id).first()

def update_pdf(db: Session, id: int, pdf: schemas.PDFRequest):
    db_pdf = db.query(models.PDF).filter(models.PDF.id == id).first()
    if db_pdf is None:
        return None
    update_data = pdf.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_pdf, key, value)
    db.commit()
    db.refresh(db_pdf)
    return db_pdf

def delete_pdf(db: Session, id: int):
    db_pdf = db.query(models.PDF).filter(models.PDF.id == id).first()
    if db_pdf is None:
        return None
    db.delete(db_pdf)
    db.commit()
    return True

def upload_pdf(db: Session, file: UploadFile, file_name: str):
    s3_client = Settings.get_s3_client()
    BUCKET_NAME = Settings().AWS_S3_BUCKET
    logging.debug(f"Attempting to upload file {file_name} to bucket {BUCKET_NAME}")
    try:
        s3_client.upload_fileobj(
            file.file,
            BUCKET_NAME,
            file_name,
            #ExtraArgs={'ACL': 'public-read'}
        )
        file_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}'
        
        db_pdf = models.PDF(name=file.filename, selected=False, file=file_url)
        db.add(db_pdf)
        db.commit()
        db.refresh(db_pdf)
        return db_pdf
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="Error in AWS credentials")
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        logging.error(f"ClientError: {error_code} - {error_message}")
        if error_code == 'AccessDenied':
            raise HTTPException(status_code=403, detail=f"Access Denied: {error_message}")
        else:
            raise HTTPException(status_code=500, detail=f"S3 Error: {error_code} - {error_message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

























def create_doc(db: Session, doc: schemas.DocRequest):
    db_doc = models.Doc(name=doc.name, read=doc.read)
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

def read_docs(db: Session):
    return db.query(models.Doc).all()
    

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