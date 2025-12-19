pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/09Natalia/api-tests'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm ci || npm install'
            }
        }
        stage('Run tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Publish report') {
            steps {
                publishHTML(target: [
                    reportDir: 'mochawesome-report',
                    reportFiles: 'mochawesome.html',
                    reportName: 'Mochawesome Report'
                ])
            }
        }
    }
}

