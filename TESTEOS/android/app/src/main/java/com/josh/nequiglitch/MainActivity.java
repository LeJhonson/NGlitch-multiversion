package com.josh.nequiglitch;

import android.os.Bundle; // ¡Importa esto!
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin; // ¡Importa esto!
import com.capacitorjs.plugins.filesystem.FilesystemPlugin; // ¡Importa el plugin!

import java.util.ArrayList; // Necesario para la lista de plugins

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // --- REGISTRO MANUAL DE PLUGINS ---
        // Esto fuerza a Capacitor a registrar el plugin de Filesystem
        // si el registro automático está fallando.
        registerPlugin(FilesystemPlugin.class);
        
        // Nota: Si tienes otros plugins que no funcionan, los agregarías aquí.
        // Ejemplo: registerPlugin(CameraPlugin.class);
    }
}