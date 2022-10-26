export {}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_URI : string; 
            PORT: string;
            SECRET: string;
            ENV: 'test' | 'dev' | 'prod';
        }
    }
}