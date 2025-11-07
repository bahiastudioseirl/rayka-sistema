<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Rayka</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
        }
        .credentials {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            background-color: #333;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>¡Bienvenido a Rayka!</h1>
    </div>
    
    <div class="content">
        <h2>Hola {{ $nombre }} {{ $apellido }},</h2>
        
        <p>Te damos la bienvenida a <strong>Rayka</strong>, nuestra plataforma de aprendizaje.</p>
        
        <p>Tu cuenta de estudiante ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso:</p>
        
        <div class="credentials">
            <h3>📧 Credenciales de Acceso</h3>
            <p><strong>Correo electrónico:</strong> {{ $correo }}</p>
            <p><strong>Contraseña:</strong> <code>{{ $contrasenia }}</code></p>
        </div>
        
        <p><strong>⚠️ Importante:</strong></p>
        <ul>
            <li>Guarda esta contraseña en un lugar seguro</li>
            <li>Te recomendamos cambiar tu contraseña después del primer inicio de sesión</li>
            <li>No compartas tus credenciales con nadie</li>
        </ul>
        
        <p>¡Esperamos que disfrutes de tu experiencia de aprendizaje!</p>
        
        <p>Saludos,<br>
        <strong>El equipo de Rayka</strong></p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} Rayka. Todos los derechos reservados.</p>
        <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
</body>
</html>