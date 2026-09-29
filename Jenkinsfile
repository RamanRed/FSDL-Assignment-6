pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest source code from GitHub...'
                checkout scm
            }
        }

        stage('Verify Source Code') {
            steps {
                echo 'Verifying workspace and downloaded repository files:'
                sh '''
                    echo "Current Workspace:"
                    pwd
                    echo "Repository Contents:"
                    ls -la
                '''
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Validating Application Structure & Docker configuration:'
                sh '''
                    test -f compose.yaml && echo "[OK] compose.yaml verified"
                    test -f backend/Dockerfile && echo "[OK] backend/Dockerfile verified"
                    test -f frontend/Dockerfile && echo "[OK] frontend/Dockerfile verified"
                '''
            }
        }
    }

    post {
        success {
            echo '=================================================='
            echo 'Assignment 6: GitHub Integration Build Successful!'
            echo '=================================================='
        }
    }
}
