from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.promesa import Promesa
from app.models.notadiario import NotaDiario
from app.models.motivacion import Motivacion
from app.models.categoria import Categoria


class PapeleraService:
    # ===============================
    # 🔹 PROMESAS INACTIVAS
    # ===============================
    @staticmethod
    def obtener_promesas_papelera(db: Session, usuario_id: int):
        return db.query(Promesa).filter(
            Promesa.usuario_id == usuario_id,
            Promesa.activo == False
        ).all()

    # ===============================
    # 🔹 NOTAS DE DIARIO INACTIVAS
    # ===============================
    @staticmethod
    def obtener_notas_papelera(db: Session, usuario_id: int):
        return db.query(NotaDiario).filter(
            NotaDiario.usuario_id == usuario_id,
            NotaDiario.activo == False
        ).all()

    # ===============================
    # 🔹 MOTIVACIONES INACTIVAS
    # ===============================
    @staticmethod
    def obtener_motivaciones_papelera(db: Session, usuario_id: int):
        return db.query(Motivacion).filter(
            Motivacion.usuario_id == usuario_id,
            Motivacion.activo == False
        ).all()

    # ===============================
    # 🔹 CATEGORÍAS INACTIVAS
    # ===============================
    @staticmethod
    def obtener_categorias_papelera(db: Session, usuario_id: int):
        return db.query(Categoria).filter(
            Categoria.usuario_id == usuario_id,
            Categoria.activo == False
        ).all()

    # ===============================
    # 🔹 RESTAURAR ELEMENTO (activo=True)
    # ===============================
    @staticmethod
    def restaurar_elemento(db: Session, tipo: str, id: int):
        modelos = {
            "promesa": Promesa,
            "diario": NotaDiario,
            "motivacion": Motivacion,
            "categoria": Categoria,
        }

        modelo = modelos.get(tipo)
        if not modelo:
            raise HTTPException(status_code=400, detail="Tipo inválido")

        elemento = db.query(modelo).filter(modelo.id == id).first()
        if not elemento:
            raise HTTPException(status_code=404, detail=f"{tipo.capitalize()} no encontrada")

        # ✅ Restaurar la categoría y sus motivaciones asociadas
        if tipo == "categoria":
            elemento.activo = True
            db.commit()
            db.refresh(elemento)

            # Reactivar motivaciones asociadas
            motivaciones_afectadas = db.query(Motivacion).filter(
                Motivacion.categoria_id == id
            ).update({"activo": True})
            db.commit()

            return {
                "mensaje": f"Categoría '{elemento.nombre}' restaurada con {motivaciones_afectadas} motivaciones asociadas."
            }

        # ✅ Para el resto de tipos
        elemento.activo = True
        db.commit()
        db.refresh(elemento)
        return {"mensaje": f"{tipo.capitalize()} restaurada correctamente"}

    # ===============================
    # 🔹 ELIMINAR DEFINITIVAMENTE
    # ===============================
    @staticmethod
    def eliminar_definitivo(db: Session, tipo: str, id: int):
        modelos = {
            "promesa": Promesa,
            "diario": NotaDiario,
            "motivacion": Motivacion,
            "categoria": Categoria,
        }

        modelo = modelos.get(tipo)
        if not modelo:
            raise HTTPException(status_code=400, detail="Tipo inválido")

        elemento = db.query(modelo).filter(modelo.id == id).first()
        if not elemento:
            raise HTTPException(status_code=404, detail=f"{tipo.capitalize()} no encontrada")

        db.delete(elemento)
        db.commit()
        return {"mensaje": f"{tipo.capitalize()} eliminada definitivamente"}
