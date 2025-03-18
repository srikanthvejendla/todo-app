pipeline {
    agent {
        node {
            label 'built-in'  // Use the built-in node
        }
    }

    tools {
        nodejs 'NodeJS'  // If you have NodeJS configured in Jenkins
    }

    environment {
        SONAR_HOST_URL = credentials('SONAR_HOST_URL')
        SONAR_TOKEN = credentials('sonar-token')
        PATH = "$PATH:/usr/local/bin"  // Add Node.js to PATH
        NVM_DIR = "/var/jenkins_home/.nvm"
        SONAR_SCANNER_VERSION = "5.0.1.3006"  // Latest stable version
        SONAR_SCANNER_OPTS = "-Dsonar.host.url=http://sonarqube:9000"  // Add this line
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/srikanthvejendla/todo-app.git',  // Your actual repository URL
                        credentialsId: 'github-token'
                    ]]
                ])
            }
        }

        stage('Setup Node.js') {
            steps {
                sh '''
                    # Install nvm
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                    
                    # Load nvm
                    . $NVM_DIR/nvm.sh
                    
                    # Install Node.js
                    nvm install 18
                    nvm use 18
                    
                    # Verify installation
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    . $NVM_DIR/nvm.sh
                    nvm use 18
                    npm ci
                '''
            }
        }

        stage('Run Tests with Coverage') {
            steps {
                sh '''
                    . $NVM_DIR/nvm.sh
                    nvm use 18
                    npm run coverage
                '''
            }
        }

        stage('SonarQube Analysis & Quality Gate') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    withSonarQubeEnv('SonarQube') {
                        script {
                            def scannerHome = tool 'SonarScanner'  // If you have SonarScanner configured in Jenkins
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                    -Dsonar.projectKey=todo-app \
                                    -Dsonar.sources=src \
                                    -Dsonar.host.url="http://sonarqube:9000" \
                                    -Dsonar.login="${SONAR_TOKEN}" \
                                    -X
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
} 