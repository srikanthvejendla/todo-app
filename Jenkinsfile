pipeline {
    agent any

    environment {
        SONAR_HOST_URL = credentials('sonar-host-url')
        SONAR_TOKEN = credentials('sonar-token')
    }

    tools {
        nodejs 'NodeJS 18' // Use the name configured in Jenkins Global Tool Configuration
    }

    stages {
        stage('Checkout') {
            steps {
                node {
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                node {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Tests with Coverage') {
            steps {
                node {
                    sh 'npm run coverage'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                node {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        withSonarQubeEnv('SonarQube') {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                    -Dsonar.projectKey=modern-todo \
                                    -Dsonar.sources=src \
                                    -Dsonar.tests=src \
                                    -Dsonar.test.inclusions=src/**/*.test.jsx,src/**/*.test.js \
                                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                            """
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                node {
                    timeout(time: 1, unit: 'HOURS') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }
    }

    post {
        always {
            node {
                cleanWs()
            }
        }
    }
} 