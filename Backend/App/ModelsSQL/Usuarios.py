from app import db_sql

class Usuario(db_sql.Model):
    id = db_sql.Column(db_sql.Integer, primary_key=True)
    nombre = db_sql.Column(db_sql.String(64), index=True, unique=True)
    email = db_sql.Column(db_sql.String(120), index=True, unique=True)
    password_hash = db_sql.Column(db_sql.String(128))
    roles = db_sql.Column(db_sql.String(64))

    def __repr__(self):
        return f'<Usuario {self.nombre}>'

    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'roles': self.roles.split(',')
        }
