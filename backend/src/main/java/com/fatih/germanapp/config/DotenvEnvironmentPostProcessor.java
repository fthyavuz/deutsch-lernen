package com.fatih.germanapp.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        File envFile = findEnvFile();
        if (envFile == null) return;

        try (FileInputStream fis = new FileInputStream(envFile)) {
            Properties props = new Properties();
            props.load(fis);
            Map<String, Object> map = new HashMap<>();
            props.forEach((k, v) -> map.put(k.toString(), v.toString().trim()));
            environment.getPropertySources().addLast(new MapPropertySource("dotenv", map));
        } catch (Exception ignored) {
        }
    }

    private File findEnvFile() {
        for (String path : new String[]{".env", "backend/.env"}) {
            File f = new File(path);
            if (f.exists()) return f;
        }
        return null;
    }
}
