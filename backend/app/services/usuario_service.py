from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.usuario import Usuario
from app.dtos.usuario_dto import UsuarioResponseDTO

# ✅ Obtener todos los usuarios
def listar_usuarios(db: Session):
    usuarios = db.query(Usuario).all()

    return [
        UsuarioResponseDTO(
            id=u.id,
            nombre=u.nombre,
            gmail=u.correo,
            fecha_registro=u.created_at,
            estado="ACTIVO" if u.activo else "INACTIVO"
        )
        for u in usuarios
    ]


# ✅ Cambiar el estado (activo ↔ inactivo)
def cambiar_estado_usuario(usuario_id: int, db: Session):
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
