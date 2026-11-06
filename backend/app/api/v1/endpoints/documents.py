import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.kyc_and_institution import DocumentCreate, DocumentResponse
from app.services.document import DocumentService
from app.shared.enums import UserRole

router = APIRouter(prefix="/documents", tags=["Farm Documents"])


@router.get(
    "",
    response_model=List[DocumentResponse],
    summary="List farm documents",
    description="Retrieve all documents uploaded by the current farmer (or for a specific user if admin)."
)
def list_documents(
    user_id: Optional[uuid.UUID] = Query(None, description="Admin filter for specific user's documents"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN, UserRole.INSTITUTIONAL_USER)),
    db: Session = Depends(get_db)
):
    target_user_id = current_user.id
    if current_user.role == UserRole.ADMIN and user_id:
        target_user_id = user_id

    return DocumentService.list_documents(db, user_id=target_user_id)


@router.post(
    "",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload farm document",
    description="Save a new document record with validation of size (<= 2.5 MB) and type."
)
def upload_document(
    payload: DocumentCreate,
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    try:
        doc = DocumentService.create_document(
            db,
            user_id=current_user.id,
            name=payload.name,
            document_type=payload.document_type,
            file_size=payload.file_size,
            file_url=payload.file_url
        )
        return doc
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete farm document",
    description="Remove a document record belonging to the authenticated farmer."
)
def delete_document(
    document_id: uuid.UUID,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    deleted = DocumentService.delete_document(db, doc_id=document_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or permission denied."
        )
    return None

