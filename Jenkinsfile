pipeline {
    agent {
        node {
            label 'built-in'  // Use the built-in node
        }
    }

    environment {
        SONAR_HOST_URL = credentials('SONAR_HOST_URL')
        SONAR_TOKEN = credentials('sonar-token')
        PATH = "$PATH:/usr/local/bin"  // Add Node.js to PATH
        NVM_DIR = "/var/jenkins_home/.nvm"
        SONAR_SCANNER_VERSION = "5.0.1.3006"  // Latest stable version
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
                        // Install SonarQube Scanner using curl
                        sh """
                            curl -L -o sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux.zip
                            unzip -o sonar-scanner.zip
                            mv sonar-scanner-${SONAR_SCANNER_VERSION}-linux sonar-scanner
                            export PATH=\$PATH:\$PWD/sonar-scanner/bin
                        """

                        // Run SonarQube Analysis
                        sh """
                            export PATH=\$PATH:\$PWD/sonar-scanner/bin
                            sonar-scanner \
                                -Dsonar.projectKey=todo-app \
                                -Dsonar.sources=src \
                                -Dsonar.tests=src \
                                -Dsonar.test.inclusions=src/**/*.test.jsx,src/**/*.test.js \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.login=${SONAR_TOKEN}
                        """

                        // Wait for Quality Gate
                        timeout(time: 1, unit: 'HOURS') {
                            waitForQualityGate abortPipeline: false
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