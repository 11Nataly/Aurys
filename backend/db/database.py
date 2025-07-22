from sqlalchemy import create_engine


#cadena de conexion
MARIADB_URL='mysql+pymysql://root:admin@localhost:3315/aurys'

#crear el objeto de conexion
engine = create_engine(MARIADB_URL)