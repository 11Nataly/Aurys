import os
import shutil
from datetime import datetime
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from app.models.motivacion import Motivacion
from app.dtos.motivacion_dto import MotivacionCreateDTO, MotivacionUpdateDTO

UPLOAD_DIR = "app/static/motivaciones"


class MotivacionService:

    # -------------------------------------------------------
    # GET - Listar motivaciones activas por usuario
    # -------------------------------------------------------
    @staticmethod
    def listar_por_usuario(usuario_id: int, db: Session):
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
    # POST - Agregar nueva motivación
    # -------------------------------------------------------
    @staticmethod
    def agregar(db: Session, data: MotivacionCreateDTO, imagen: UploadFile = None):
        try:
            os.makedirs(UPLOAD_DIR, exist_ok=True)

            ruta_imagen = None
            if imagen:
                nombre_imagen = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{imagen.filename}"
                ruta_local = os.path.join(UPLOAD_DIR, nombre_imagen)
                with open(ruta_local, "wb") as buffer:
                    shutil.copyfileobj(imagen.file, buffer)
                ruta_imagen = f"http://127.0.0.1:8000/static/motivaciones/{nombre_imagen}"

            nueva = Motivacion(
                titulo=data.titulo,
                descripcion=data.descripcion,
                categoria_id=data.categoria_id,
                usuario_id=data.usuario_id,
                imagen=ruta_imagen,
                activo=True,
                esFavorita=False
            )
            db.add(nueva)
            db.commit()
            db.refresh(nueva)
            return nueva

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al crear la motivación: {str(e)}")

    # -------------------------------------------------------
    # PUT - Cambiar “favorita” (me gusta)
    # -------------------------------------------------------
    @staticmethod
    def cambiar_favorita(db: Session, motivacion_id: int, favorita: bool | None = None):
        motivacion = db.query(Motivacion).filter_by(id=motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        if favorita is None:
            motivacion.esFavorita = not motivacion.esFavorita
        else:
            motivacion.esFavorita = favorita

        db.commit()
        db.refresh(motivacion)
        return {
            "message": "Estado de favorita actualizado correctamente",
            "esFavorita": motivacion.esFavorita
        }

    # -------------------------------------------------------
    # PUT - Editar texto
    # -------------------------------------------------------
    @staticmethod
    def editar(db: Session, motivacion_id: int, data: MotivacionUpdateDTO):
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
    # PUT - Modificar (con nueva imagen)
    # -------------------------------------------------------
    @staticmethod
    def modificar(db: Session, motivacion_id: int, data: MotivacionUpdateDTO, imagen: UploadFile = None):
        motivacion = db.query(Motivacion).filter(Motivacion.id == motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

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
    # PUT - Cambiar estado activo/inactivo
    # -------------------------------------------------------
    @staticmethod
    
    def cambiar_estado(motivacion_id: int, estado: bool, db: Session):
        motivacion = db.query(Motivacion).filter(Motivacion.id == motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        motivacion.activo = estado
        db.commit()
        db.refresh(motivacion)

        return motivacion

    # -------------------------------------------------------
    # PUT - Actualizar solo la imagen
    # -------------------------------------------------------
    @staticmethod
    def editar_imagen(db: Session, motivacion_id: int, imagen: UploadFile):
        motivacion = db.query(Motivacion).filter(Motivacion.id == motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        if not imagen:
            raise HTTPException(status_code=400, detail="Debe enviar una imagen para actualizar")

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

        db.commit()
        db.refresh(motivacion)
        return motivacion

    # -------------------------------------------------------
    # DELETE - Eliminar definitivamente una motivación
    # -------------------------------------------------------
    # -------------------------------------------------------
    # DELETE - Eliminar una motivación (definitivamente)
    # -------------------------------------------------------
    @staticmethod
    def eliminar_motivacion(db: Session, motivacion_id: int):
        """
        Elimina una motivación permanentemente de la base de datos
        sin eliminar ni afectar su categoría asociada.
        """
        motivacion = db.query(Motivacion).filter(Motivacion.id == motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        # 🗑 Eliminar imagen asociada si existe
        if motivacion.imagen:
            nombre_archivo = motivacion.imagen.split("/")[-1]
            ruta_archivo = os.path.join(UPLOAD_DIR, nombre_archivo)
            if os.path.exists(ruta_archivo):
                os.remove(ruta_archivo)

        db.delete(motivacion)
        db.commit()

        return {"mensaje": f"Motivación {motivacion_id} eliminada permanentemente"}




# ✅ Instancia global del servicio
motivacion_service = MotivacionService()
