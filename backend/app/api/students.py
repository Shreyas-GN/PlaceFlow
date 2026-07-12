from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.student import StudentOnboarding, StudentProfileUpdate, StudentResponse
from app.services.auth_service import AuthService, get_db
from app.models.student import Student

router = APIRouter(prefix="/students", tags=["students"])


@router.post("/onboarding", response_model=StudentResponse)
def submit_onboarding(
    data: StudentOnboarding,
    current_user: Student = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.profile_complete:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Onboarding is already complete.",
        )

    # Ensure roll_number is unique across other students
    conflict = (
        db.query(Student)
        .filter(Student.roll_number == data.roll_number, Student.id != current_user.id)
        .first()
    )
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This roll number is already registered.",
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    current_user.profile_complete = True
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/profile", response_model=StudentResponse)
def update_profile(
    data: StudentProfileUpdate,
    current_user: Student = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
