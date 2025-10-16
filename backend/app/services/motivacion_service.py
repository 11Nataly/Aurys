import os
import shutil
from datetime import datetime
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.models.motivacion import Motivacion
from app.dtos.motivacion_dto import MotivacionCreateDTO, MotivacionUpdateDTO

# Directorio donde se guardan las imágenes
UPLOAD_DIR = "app/static/motivaciones"


class MotivacionService:

    # -------------------------------------------------------
    # GET - Listar motivaciones activas por usuario
    # -------------------------------------------------------
    @staticmethod
    def listar_por_usuario(usuario_id: int, db: Session):
        """
        Lista todas las motivaciones activas (activo=1) de un usuario.
        Devuelve toda la información si activo=1, si es 0 no muestra nada.
        """
        motivaciones = db.query(Motivacion).filter(
            Motivacion.usuario_id == usuario_id,
            Motivacion.activo == True
        ).all()

        if not motivaciones:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron motivaciones activas para este usuario."
            )

        return motivaciones

    # -------------------------------------------------------
    # POST - Agregar nueva motivación con imagen opcional
    # -------------------------------------------------------
    @staticmethod
    def agregar(db: Session, data: MotivacionCreateDTO, imagen: UploadFile = None):
        """
        Crea una nueva motivación con imagen opcional.
        Guarda la imagen en /static/motivaciones y genera la URL.
        """
        try:
            os.makedirs(UPLOAD_DIR, exist_ok=True)

            ruta_imagen = None
            if imagen:
                # Crear nombre único para evitar colisiones
                nombre_imagen = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{imagen.filename}"
                ruta_local = os.path.join(UPLOAD_DIR, nombre_imagen)

                with open(ruta_local, "wb") as buffer:
                    shutil.copyfileobj(imagen.file, buffer)

                # URL pública
                ruta_imagen = f"http://127.0.0.1:8000/static/motivaciones/{nombre_imagen}"

            nueva = Motivacion(
                titulo=data.titulo,
                descripcion=data.descripcion,
                categoria_id=data.id_categoria,
                usuario_id=data.id_usuario,
                imagen=ruta_imagen,
                activo=True,
                esFavorita=False  # ✅ según el modelo
            )

            db.add(nueva)
            db.commit()
            db.refresh(nueva)
            return nueva

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al crear la motivación: {str(e)}")

    # -------------------------------------------------------
    # PUT - Cambiar "esFavorita" (favorita / no favorita)
    # -------------------------------------------------------
class MotivacionService:

    @staticmethod
    def cambiar_favorita(db: Session, motivacion_id: int, favorita: bool = None):
        """
        Cambia el estado de 'esFavorito' (me gusta / no me gusta).
        - Si favorita es None → hace toggle automático.
        - Si favorita=True → marca como favorita.
        - Si favorita=False → desmarca.
        """
        motivacion = db.query(Motivacion).filter_by(id=motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        if favorita is None:
            # Toggle automático
            motivacion.esFavorito = not motivacion.esFavorito
        else:
            motivacion.esFavorito = favorita

        db.commit()
        db.refresh(motivacion)
        return {"message": "Estado de favorita actualizado correctamente", "esFavorito": motivacion.esFavorito}

    # -------------------------------------------------------
    # PUT - Editar información (sin imagen)
    # -------------------------------------------------------
    @staticmethod
    def editar(db: Session, motivacion_id: int, data: MotivacionUpdateDTO):
        """
        Permite editar los datos de una motivación sin cambiar imagen.
        """
        motivacion = db.query(Motivacion).filter(Motivacion.id == motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        if data.titulo:
            motivacion.titulo = data.titulo
        if data.descripcion:
            motivacion.descripcion = data.descripcion
        if data.id_categoria:
            motivacion.categoria_id = data.id_categoria

        db.commit()
        db.refresh(motivacion)
        return motivacion

    # -------------------------------------------------------
    # PUT - Modificar motivación (incluyendo nueva imagen)
    # -------------------------------------------------------
    @staticmethod
    def modificar(db: Session, motivacion_id: int, data: MotivacionUpdateDTO, imagen: UploadFile = None):
        """
        Permite actualizar toda la motivación, incluyendo una nueva imagen.
        """
        motivacion = db.query(Motivacion).filter(Motivacion.id == motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        # Si hay nueva imagen, eliminar la anterior y guardar la nueva
        if imagen:
            if motivacion.imagen:
                nombre_antiguo = motivacion.imagen.split("/")[-1]
                ruta_antigua = os.path.join(UPLOAD_DIR, nombre_antiguo)
                if os.path.exists(ruta_antigua):
                    os.remove(ruta_antigua)

            nombre_nueva = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{imagen.filename}"
            ruta_guardado = os.path.join(UPLOAD_DIR, nombre_nueva)

            with open(ruta_guardado, "wb") as buffer:
                shutil.copyfileobj(imagen.file, buffer)

            motivacion.imagen = f"http://127.0.0.1:8000/static/motivaciones/{nombre_nueva}"

        # Actualizar datos básicos
        if data.titulo:
            motivacion.titulo = data.titulo
        if data.descripcion:
            motivacion.descripcion = data.descripcion
        if data.id_categoria:
            motivacion.categoria_id = data.id_categoria

        db.commit()
        db.refresh(motivacion)
        return motivacion
