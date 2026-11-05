import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.document import FarmDocument
from app.models.farm import Farm


class DocumentService:
    @staticmethod
    def list_documents(db: Session, user_id: uuid.UUID) -> List[FarmDocument]:
        return list(
            db.scalars(
                select(FarmDocument)
                .where(FarmDocument.user_id == user_id)
                .order_by(FarmDocument.uploaded_at.desc())
            ).all()
        )

    @staticmethod
    def get_document(
        db: Session,
        doc_id: uuid.UUID,
        user_id: Optional[uuid.UUID] = None
    ) -> Optional[FarmDocument]:
        stmt = select(FarmDocument).where(FarmDocument.id == doc_id)
        if user_id:
            stmt = stmt.where(FarmDocument.user_id == user_id)
        return db.scalar(stmt)

    @staticmethod
    def create_document(
        db: Session,
        user_id: uuid.UUID,
        name: str,
        document_type: str,
        file_size: int,
        file_url: str
    ) -> FarmDocument:
        if file_size > 2_500_000:
            raise ValueError("File size exceeds 2.5 MB limit.")

        farm = db.scalar(select(Farm).where(Farm.user_id == user_id))
        farm_id = farm.id if farm else None

        doc = FarmDocument(
            user_id=user_id,
            farm_id=farm_id,
            name=name.strip(),
            document_type=document_type.strip(),
            file_size=file_size,
            file_url=file_url
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return doc

    @staticmethod
    def delete_document(db: Session, doc_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        doc = db.scalar(
            select(FarmDocument).where(
                FarmDocument.id == doc_id,
                FarmDocument.user_id == user_id
            )
        )
        if not doc:
            return False

        db.delete(doc)
        db.commit()
        return True

