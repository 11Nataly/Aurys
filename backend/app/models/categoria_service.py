# app/services/categoria_service.py

from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.categoria import Categoria
from app.models.motivacion import Motivacion
from app.dtos.categoria_dtos import (
    CategoriaCreateDTO,
    CategoriaEstadoDTO
)


class CategoriaService:
    # -------------------------------------------------------
    # LISTAR CATEGORÍAS ACTIVAS POR USUARIO
    # -------------------------------------------------------
    @staticmethod
    def listar_por_usuario(db: Session, usuario_id: int):
        """
        Retorna todas las categorías activas pertenecientes a un usuario.
        """
        categorias = db.query(Categoria).filter(
            Categoria.usuario_id == usuario_id,
            Categoria.activo == True
        ).all()

        if not categorias:
            raise HTTPException(status_code=404, detail="No hay categorías activas para este usuario")

        return categorias

    # -------------------------------------------------------
    # AGREGAR NUEVA CATEGORÍA
    # -------------------------------------------------------
    @staticmethod
    def agregar_categoria(db: Session, dto: CategoriaCreateDTO):
        """
        Agrega una nueva categoría asociada a un usuario.
        """
        nueva = Categoria(
            usuario_id=dto.usuario_id,
            nombre=dto.nombre,
            esPredeterminada=dto.esPredeterminada if dto.esPredeterminada is not None else False,
            activo=dto.activo if dto.activo is not None else True
        )
        db.add(nueva)
        db.commit()
        db.refresh(nueva)
        return nueva

    # -------------------------------------------------------
    # CAMBIAR ESTADO (ACTIVO/INACTIVO)
    # -------------------------------------------------------
    @staticmethod
    def cambiar_estado_categoria(db: Session, categoria_id: int, dto: CategoriaEstadoDTO):
        """
        Cambia el estado de una categoría (activo/inactivo).
        Si se desactiva, también desactiva las motivaciones relacionadas.
        """
        categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        categoria.activo = dto.activo
        db.commit()
        db.refresh(categoria)

        # Si se desactiva, también desactivar motivaciones asociadas
        if not dto.activo:
            db.query(Motivacion).filter(
                Motivacion.categoria_id == categoria_id
            ).update({"activo": False})
            db.commit()

        return categoria

    # -------------------------------------------------------
    # LISTAR NOMBRES E IDs DE CATEGORÍAS ACTIVAS
    # -------------------------------------------------------
    @staticmethod
    def listar_nombres_activos(db: Session, usuario_id: int):
        """
        Devuelve los IDs y nombres de las categorías activas de un usuario.
        """
        categorias = db.query(Categoria.id, Categoria.nombre).filter(
            Categoria.usuario_id == usuario_id,
            Categoria.activo == True
        ).all()

        if not categorias:
            raise HTTPException(status_code=404, detail="No hay categorías activas para este usuario")

        # Convertir resultado a lista de diccionarios
        return [{"id": c.id, "nombre": c.nombre} for c in categorias]


# Instancia del servicio para importar fácilmente
categoria_service = CategoriaService()
