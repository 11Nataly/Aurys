# test_sendgrid_final.py
import os
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Cargar variables de entorno
load_dotenv()

def verificar_sendgrid():
    # 1. Verificar API Key
    api_key = os.getenv('SENDGRID_API_KEY')
    from_email = os.getenv('FROM_EMAIL', 'auryssalud@gmail.com')
    
    print("=" * 50)
    print("🔍 VERIFICACIÓN DE SENDGRID")
    print("=" * 50)
    
    if not api_key:
        print("❌ SENDGRID_API_KEY no encontrada en .env")
        return False
    
    if not api_key.startswith('SG.'):
        print("❌ API Key no tiene formato correcto")
        return False
    
    print(f"✅ API Key formato correcto: {api_key[:15]}...")
    print(f"✅ From Email: {from_email}")
    
    try:
        # 2. Probar conexión
        print("\n🔗 Probando conexión...")
        sg = SendGridAPIClient(api_key)
        
        # Verificar API Key
        response = sg.client.user.profile.get()
        
        if response.status_code == 200:
            print("✅ API Key válida y autorizada")
        else:
            print(f"❌ Problema con API Key: {response.status_code}")
            return False
        
        # 3. Probar envío de email
        print("\n📧 Probando envío de email...")
        
        message = Mail(
            from_email=from_email,
            to_emails=from_email,  # Enviarse a sí mismo
            subject='🧪 Test SendGrid - Euipomed',
            html_content='''
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #28a745;">✅ SendGrid Funcionando</h2>
                <p>Este email confirma que SendGrid está configurado correctamente.</p>
                <p><strong>Fecha:</strong> ''' + str(os.popen('date').read().strip()) + '''</p>
            </div>
            '''
        )
        
        response = sg.send(message)
        
        if response.status_code == 202:
            print("✅ Email enviado correctamente")
            print("📬 Revisa tu bandeja de entrada (y spam)")
            return True
        else:
            print(f"❌ Error enviando email: {response.status_code}")
            print(f"Headers: {response.headers}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print(f"Tipo: {type(e).__name__}")
        
        # Mensajes de ayuda específicos
        if "401" in str(e):
            print("\n🔧 SOLUCIONES PARA ERROR 401:")
            print("1. Verifica que el Single Sender esté confirmado en Gmail")
            print("2. Crea una nueva API Key con Full Access")
            print("3. Asegúrate de copiar la API Key completa")
        elif "403" in str(e):
            print("\n🔧 ERROR 403: Tu cuenta SendGrid puede estar suspendida")
        
        return False

if __name__ == "__main__":
    if verificar_sendgrid():
        print("\n🎉 ¡SendGrid configurado correctamente!")
    else:
        print("\n💥 Hay problemas con la configuración")