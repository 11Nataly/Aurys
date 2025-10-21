from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.dtos.tecnica_dto import (
    TecnicaCreateDTO,
    TecnicaUpdateDTO,
    CalificacionCreateDTO,
    CalificacionResponseDTO,
    TecnicaAdministrador,
    TecnicaCard
    
)
import re
import cloudinary.uploader
from app.models.tecnica_calificacion import TecnicaCalificacion
from app.models.tecnicaFavorita import TecnicaFavorita

# ==============================
# CRUD Técnicas
# ==============================

def crear_tecnica(db: Session, dto: TecnicaCreateDTO):
    tecnica = TecnicaAfrontamiento(
        usuario_id=dto.usuario_id,
        nombre=dto.nombre,
        descripcion=dto.descripcion,
        instruccion=dto.instruccion,
        duracion_video=dto.horas * 3600 + dto.minutos * 60 + dto.segundos
    )
    db.add(tecnica)
    db.commit()
    db.refresh(tecnica)
    return tecnica

def actualizar_tecnica(db: Session, tecnica_id: int, dto: TecnicaUpdateDTO):
    tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()
    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")

    if dto.nombre is not None:
        tecnica.nombre = dto.nombre
    if dto.descripcion is not None:
        tecnica.descripcion = dto.descripcion
    if dto.instruccion is not None:
        tecnica.instruccion = dto.instruccion
    if dto.horas is not None or dto.minutos is not None or dto.segundos is not None:
        h = dto.horas or 0
        m = dto.minutos or 0
        s = dto.segundos or 0
        tecnica.duracion_video = h * 3600 + m * 60 + s

    db.commit()
    db.refresh(tecnica)
    return tecnica

def obtener_tecnica_por_id(db: Session, tecnica_id: int):
    return db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()

def eliminar_tecnica(db: Session, tecnica_id: int):
    tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()
    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")

    if tecnica.video:
        try:
            match = re.search(r"/([^/]+)\.mp4$", tecnica.video)
            if match:
                public_id = match.group(1)
                cloudinary.uploader.destroy(public_id, resource_type="video")
        except Exception as e:
            print(f"Error eliminando video: {str(e)}")

    db.delete(tecnica)
    db.commit()
    return {"message": "Técnica eliminada correctamente"}

def simplificar_duracion(segundos: int) -> str:
    if segundos >= 3600:
        horas = round(segundos / 3600)
        return f"{horas} hora{'s' if horas > 1 else ''}"
    elif segundos >= 60:
        minutos = round(segundos / 60)
        return f"{minutos} minuto{'s' if minutos > 1 else ''}"
    else:
        return f"{segundos} segundo{'s' if segundos > 1 else ''}"

# ==============================
# Calificaciones
# ==============================

def crear_calificacion(db: Session, dto: CalificacionCreateDTO) -> CalificacionResponseDTO:
    tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == dto.tecnica_id).first()
    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")
    tecnica.calificacion = dto.estrellas
    db.commit()
    db.refresh(tecnica)
    return CalificacionResponseDTO.model_validate(tecnica)

def calificar_tecnica(db: Session, usuario_id: int, tecnica_id: int, dto: CalificacionCreateDTO):
    tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()
    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")
    tecnica.calificacion = dto.estrellas
    db.commit()
    db.refresh(tecnica)
    return CalificacionResponseDTO.model_validate(tecnica)



#==============================
# Tecnica Administrador Get
#===============================


def listar_tecnicas_administrador(db: Session):
    tecnicas = db.query(TecnicaAfrontamiento).all()
    resultado = []
    for tecnica in tecnicas:
        dto = TecnicaAdministrador(
            id=tecnica.id,
            nombre=tecnica.nombre,
            descripcion=tecnica.descripcion,
            duracion=simplificar_duracion(tecnica.duracion_video)
        )
        resultado.append(dto)
    return resultado



#==============================
# Tecnica usuario Get
#===============================
def listar_tecnicas_con_estado(db: Session, usuario_id: int):
    tecnicas = db.query(TecnicaAfrontamiento).all()

    # Obtener IDs de calificaciones y favoritas del usuario
    calificaciones = {
        c.tecnica_id: c.estrellas
        for c in db.query(TecnicaCalificacion)
        .filter(TecnicaCalificacion.usuario_id == usuario_id)
        .all()
    }

    favoritas = {
        f.tecnica_id
        for f in db.query(TecnicaFavorita)
        .filter(TecnicaFavorita.usuario_id == usuario_id)
        .all()
    }

    resultado = []
    for tecnica in tecnicas:
        dto = TecnicaCard(
            id=tecnica.id,
            nombre=tecnica.nombre,
            descripcion=tecnica.descripcion,
            video=tecnica.video,
            instruccion=tecnica.instruccion,
            duracion=simplificar_duracion(tecnica.duracion_video),
            calificacion=calificaciones.get(tecnica.id, tecnica.calificacion),
            favorita=tecnica.id in favoritas
        )
        resultado.append(dto)

    return resultado


def actualizar_estado_tecnica(db, usuario_id: int, tecnica_id: int, estrellas: int | None, favorita: bool | None):
    # ⭐ Actualizar calificación
    if estrellas is not None:
        calificacion = (
            db.query(TecnicaCalificacion)
            .filter_by(usuario_id=usuario_id, tecnica_id=tecnica_id)
            .first()
        )
        if calificacion:
            calificacion.estrellas = estrellas
        else:
            db.add(TecnicaCalificacion(usuario_id=usuario_id, tecnica_id=tecnica_id, estrellas=estrellas))

    # ❤ Actualizar favorito
    if favorita is not None:
        favorito = (
            db.query(TecnicaFavorita)
            .filter_by(usuario_id=usuario_id, tecnica_id=tecnica_id)
            .first()
        )
        if favorita and not favorito:
            db.add(TecnicaFavorita(usuario_id=usuario_id, tecnica_id=tecnica_id))
        elif not favorita and favorito:
            db.delete(favorito)

    db.commit()
    return {"message": "Estado actualizado correctamente"}