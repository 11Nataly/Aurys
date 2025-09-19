from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, case
# Importar los modelos desde el nuevo paquete
from app.models import TecnicaAfrontamiento, TecnicaCalificacion, TecnicaFavorita
from app.dtos.tecnica_dto import (
    TecnicaCreateDTO,
    TecnicaUpdateDTO,
    CalificacionCreateDTO,
    CalificacionResponseDTO
)
import re
import cloudinary.uploader



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
    """
    Convierte una duración en segundos a formato simplificado
    (ej: '2 horas', '15 minutos', '30 segundos').
    """
    if segundos >= 3600:
        horas = round(segundos / 3600)
        return f"{horas} hora{'s' if horas > 1 else ''}"
    elif segundos >= 60:
        minutos = round(segundos / 60)
        return f"{minutos} minuto{'s' if minutos > 1 else ''}"
    else:
        return f"{segundos} segundo{'s' if segundos > 1 else ''}"
    
    
 # ==============================
# Mostrar tecncias con sus calificaciones y favoritos
# ==============================
   
def listar_tecnicas_con_estado(db: Session, usuario_id: int):
    """
    Lista todas las técnicas de afrontamiento, incluyendo el estado de
    calificación y si está marcada como favorita para un usuario específico.

    Esta función utiliza una sola consulta optimizada para evitar
    el problema N+1 y mejorar el rendimiento.
    """
    # Consulta optimizada que usa LEFT JOIN para unir las tablas.
    # El LEFT JOIN asegura que se incluyan todas las técnicas, incluso
    # si el usuario no las ha calificado o marcado como favoritas.
    # El `case` se usa para determinar si un registro existe para el usuario.
    tecnicas = (
        db.query(
            TecnicaAfrontamiento,
            TecnicaCalificacion.estrellas.label("calificacion"),
            case((TecnicaFavorita.tecnica_id.isnot(None), True), else_=False).label("favorita")
        )
        .outerjoin(TecnicaCalificacion, (TecnicaCalificacion.tecnica_id == TecnicaAfrontamiento.id) & (TecnicaCalificacion.usuario_id == usuario_id))
        .outerjoin(TecnicaFavorita, (TecnicaFavorita.tecnica_id == TecnicaAfrontamiento.id) & (TecnicaFavorita.usuario_id == usuario_id))
        .all()
    )

    # Procesar los resultados y construir la lista final
    resultado = []
    for tecnica, calificacion, favorita in tecnicas:
        resultado.append({
            "id": tecnica.id,
            "nombre": tecnica.nombre,
            "descripcion": tecnica.descripcion,
            "video": tecnica.video,
            "instruccion": tecnica.instruccion,
            # Aplicar la función simplificar_duracion
            # que convierta una duración en segundos
            # a formato simplificado (ej: '2 horas', '15 minutos', '30 segundos')
            "duracion": simplificar_duracion(tecnica.duracion_video),
            "calificacion": calificacion,
            "favorita": favorita
        })
    
    return resultado
    
    
    

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
