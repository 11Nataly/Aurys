from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.categoria import Categoria
from app.models.motivacion import Motivacion
from app.dtos.categoria_dtos import CategoriaCreateDTO, CategoriaEstadoDTO


class CategoriaService:
    # -------------------------------------------------------
    # LISTAR CATEGORÍAS ACTIVAS POR USUARIO
    # -------------------------------------------------------
    @staticmethod
    def listar_por_usuario(db: Session, usuario_id: int):
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
        categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        # Cambiar estado de la categoría
        categoria.activo = dto.activo
        db.commit()
        db.refresh(categoria)

        # 🔄 Sincronizar motivaciones asociadas
        motivaciones_afectadas = db.query(Motivacion).filter(
            Motivacion.categoria_id == categoria_id
        ).update({"activo": dto.activo})
        db.commit()

        if dto.activo:
            print(f"🔁 Reactivadas {motivaciones_afectadas} motivaciones asociadas a la categoría {categoria_id}")
        else:
            print(f"🔁 Desactivadas {motivaciones_afectadas} motivaciones asociadas a la categoría {categoria_id}")

        # ✅ Devolver la categoría actualizada
        return categoria

    # -------------------------------------------------------
    # LISTAR NOMBRES E IDs DE CATEGORÍAS ACTIVAS
    # -------------------------------------------------------
    @staticmethod
    def listar_nombres_activos(db: Session, usuario_id: int):
        categorias = db.query(Categoria.id, Categoria.nombre).filter(
            Categoria.usuario_id == usuario_id,
            Categoria.activo == True
        ).all()

        if not categorias:
            raise HTTPException(status_code=404, detail="No hay categorías activas para este usuario")

        return [{"id": c.id, "nombre": c.nombre} for c in categorias]

    # -------------------------------------------------------
    # EDITAR SOLO EL NOMBRE DE UNA CATEGORÍA
    # -------------------------------------------------------
    @staticmethod
    def editar_nombre(db: Session, categoria_id: int, usuario_id: int, nombre: str):
        categoria = db.query(Categoria).filter(
            Categoria.id == categoria_id,
            Categoria.usuario_id == usuario_id
        ).first()

        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada para este usuario")

        categoria.nombre = nombre
        db.commit()
        db.refresh(categoria)
        return categoria

    # -------------------------------------------------------
    # ELIMINAR CATEGORÍA Y SUS MOTIVACIONES ASOCIADAS
    # -------------------------------------------------------
    @staticmethod
    def eliminar_categoria(db: Session, categoria_id: int):
        categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
        if not categoria:
            raise HTTPException(status_code=404, detail=f"Categoría con id {categoria_id} no encontrada")

        # 🗑 Eliminar motivaciones asociadas
        db.query(Motivacion).filter(Motivacion.categoria_id == categoria_id).delete()

        # 🗑 Eliminar categoría
        db.delete(categoria)
        db.commit()

        return {"mensaje": f"Categoría {categoria_id} y sus motivaciones asociadas fueron eliminadas correctamente"}


# ✅ Instancia global del servicio
categoria_service = CategoriaService()
