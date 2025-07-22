from fastapi import APIRouter, Depends 
from sqlalchemy.orm import session 
from models.rol import Rol 
from dtos.rol_dto import RolCreateDTO
from db.session import SessionLocal

#objeto que contiene este grupo
#de rutas 

#obtener el objeto session
#para create

def get_session():
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()

router = APIRouter(prefix='/roles')

#crean cada ruta en el grupo 

@router.get('/')
def listar_roles():
    return"lista de roles"

#ruta parametrizada 

@router.get('/{id}')
def listar_por_id(id: int ):
    return"listando roles cuyo id es " + str(id)

#RUTA POST 
@router.post("/")
def crear_rol(
                nuevo_rol: RolCreateDTO, 
                db:session = Depends(get_session)
        ):
    #crear rol 
    nr = Rol(
       nombre = nuevo_rol.nombre
    )
   #inserto el nuevo rol 
    db.add(nr)
   #confirmo la transaccion manualmente 
    db.commit()
    #nueva rol lo dispongo en proyecto 
    db.refresh(nr)
    return nr

#ruta de update:
@router.put("/{id}")
def actualizar_rol(id: int ):
    return"actualizar rol" + str(id)


