import os
from fastapi import HTTPException, UploadFile, Request
from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.dtos.perfil_dto import PerfilResponseDTO, PerfilUpdateDTO
from app.services.loginRegister_service import get_password_hash  # 🔐 Import para cifrar contraseñas

UPLOAD_DIR = "uploads/fotos"


class PerfilService:
    # ✅ Listar perfiles (con URL absoluta de imagen)
    @staticmethod
    def listar_perfiles(db: Session, request: Request):
        base_url = str(request.base_url).rstrip("/")
        usuarios = db.query(Usuario).all()

        return [
            PerfilResponseDTO(
                id=u.id,
                nombre=u.nombre,
                correo=u.correo,
                foto_perfil=f"{base_url}/{u.foto_perfil}" if u.foto_perfil else None,
                fecha_registro=u.created_at,
                estado="ACTIVO" if u.activo else "INACTIVO"
            )
            for u in usuarios
        ]

    # ✅ Cambiar estado (activar/desactivar perfil)
    @staticmethod
    def cambiar_estado_perfil(usuario_id: int, db: Session):
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        usuario.activo = not usuario.activo
        db.commit()
        db.refresh(usuario)

        return {
            "mensaje": f"El usuario '{usuario.nombre}' ahora está {'ACTIVO' if usuario.activo else 'INACTIVO'}",
            "estado_actual": "ACTIVO" if usuario.activo else "INACTIVO"
        }

    # ✅ Actualizar datos de perfil (solo texto)
    @staticmethod
    def actualizar_perfil(usuario_id: int, dto: PerfilUpdateDTO, db: Session):
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        if dto.nombre:
            usuario.nombre = dto.nombre
        if dto.correo:
            usuario.correo = dto.correo
        if dto.contrasena:
            usuario.contrasena = dto.contrasena  # ⚠️ en producción deberías cifrarla

        db.commit()
        db.refresh(usuario)

        return PerfilResponseDTO(
            id=usuario.id,
            nombre=usuario.nombre,
            correo=usuario.correo,
            foto_perfil=usuario.foto_perfil,
            fecha_registro=usuario.created_at,
            estado="ACTIVO" if usuario.activo else "INACTIVO"
        )

    # ✅ Actualizar perfil completo (nombre, correo y foto) usando FormData
    @staticmethod
    async def actualizar_perfil_completo(usuario_id: int, nombre: str, correo: str, foto: UploadFile | None, db: Session):
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        # --- Actualizar texto ---
        usuario.nombre = nombre
        usuario.correo = correo

        # --- Actualizar imagen si se envía ---
        if foto:
            if not os.path.exists(UPLOAD_DIR):
                os.makedirs(UPLOAD_DIR)

            extension = foto.filename.split(".")[-1]
            filename = f"{usuario_id}_perfil.{extension}"
            file_path = os.path.join(UPLOAD_DIR, filename)

            with open(file_path, "wb") as buffer:
                buffer.write(foto.file.read())

            usuario.foto_perfil = file_path.replace("\\", "/")

        db.commit()
        db.refresh(usuario)

        # --- Retornar DTO consistente ---
        return PerfilResponseDTO(
            id=usuario.id,
            nombre=usuario.nombre,
            correo=usuario.correo,
            foto_perfil=usuario.foto_perfil,
            fecha_registro=usuario.created_at,
            estado="ACTIVO" if usuario.activo else "INACTIVO"
        )

        # --- Retornar DTO consistente ---
        return PerfilResponseDTO(
            id=usuario.id,
            nombre=usuario.nombre,
            correo=usuario.correo,
            foto_perfil=usuario.foto_perfil,
            fecha_registro=usuario.created_at,
            estado="ACTIVO" if usuario.activo else "INACTIVO"
        )

    # ✅ Subir o cambiar foto de perfil
    @staticmethod
    def actualizar_foto_perfil(usuario_id: int, file: UploadFile, db: Session, request: Request):
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        extension = file.filename.split(".")[-1]
        filename = f"{usuario_id}_perfil.{extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        usuario.foto_perfil = file_path.replace("\\", "/")
        db.commit()
        db.refresh(usuario)

        base_url = str(request.base_url).rstrip("/")
        foto_url = f"{base_url}/{usuario.foto_perfil}"

        return {"mensaje": "Foto actualizada correctamente", "url": foto_url}