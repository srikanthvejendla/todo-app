pipeline {
    agent {
        node {
            label 'built-in'  // Use the built-in node
        }
    }

    environment {
        SONAR_HOST_URL = 'http://sonarqube:9000'  // Set explicitly
        SONAR_TOKEN = credentials('sonar-token')
        PATH = "$PATH:/usr/local/bin"  // Add Node.js to PATH
        NVM_DIR = "/var/jenkins_home/.nvm"
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

        stage('SonarQube Analysis') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    withSonarQubeEnv('SonarQube') {
                        script {
                            def scannerHome = tool 'SonarScanner'
                            sh """
                                # Debug info
                                echo "Scanner Home: ${scannerHome}"
                                echo "SonarQube URL: ${SONAR_HOST_URL}"
                                
                                # Test SonarQube connection
                                curl -v ${SONAR_HOST_URL}/api/system/status
                                
                                # Run scanner
                                ${scannerHome}/bin/sonar-scanner \
                                    -Dsonar.projectKey=todo-app \
                                    -Dsonar.projectName='Todo App' \
                                    -Dsonar.sources=src \
                                    -Dsonar.host.url=${SONAR_HOST_URL} \
                                    -Dsonar.login=${SONAR_TOKEN} \
                                    -Dsonar.sourceEncoding=UTF-8 \
                                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                    -Dsonar.verbose=true \
                                    -X
                            """
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
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