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
    # 🔹 RESTAURAR ELEMENTO (poner activo=True)
    # ===============================
    @staticmethod
    def restaurar_elemento(db: Session, tipo: str, id: int):
        modelo = {
            "promesa": Promesa,
            "diario": NotaDiario,
            "motivacion": Motivacion,
            "categoria": Categoria,
        }.get(tipo)

        if not modelo:
            return None

        elemento = db.query(modelo).filter(modelo.id == id).first()
        if not elemento:
            return None

        elemento.activo = True
        db.commit()
        db.refresh(elemento)
        return elemento

    # ===============================
    # 🔹 ELIMINAR DEFINITIVAMENTE
    # ===============================
    @staticmethod
    def eliminar_definitivo(db: Session, tipo: str, id: int):
        modelo = {
            "promesa": Promesa,
            "diario": NotaDiario,
            "motivacion": Motivacion,
            "categoria": Categoria,
        }.get(tipo)

        if not modelo:
            return None

        elemento = db.query(modelo).filter(modelo.id == id).first()
        if not elemento:
            return None

        db.delete(elemento)
        db.commit()
        return {"message": f"{tipo.capitalize()} eliminada definitivamente"}
