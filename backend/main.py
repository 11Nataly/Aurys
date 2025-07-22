##Rutas rest del proyecto 

#importacion del objeto
#aplicacion 

from fastapi import FastAPI
from controllers.rol_controllers import router 


#crear el objeto aplicacion

app = FastAPI()

#conectar el grupo roles
#al objeto aplicacion

app.include_router(router=router)

