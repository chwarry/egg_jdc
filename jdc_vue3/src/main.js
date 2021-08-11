import { createApp } from 'vue';
import App from './App.vue';
import { router, setupRouter } from '@/routes/index';
import { setupStore } from '@/store/index';
import { setElement } from '@/plugins/element';
import '@/style/index.css';

async function bootstrap() {
    const app = createApp(App);

    // Configure store
    setupStore(app);
    // Configure routing
    setupRouter(app);
    // Configure element
    setElement(app);

    await router.isReady();

    app.mount('#app', true);
}

void bootstrap();
