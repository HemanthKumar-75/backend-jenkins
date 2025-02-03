pipeline {
    agent {
        label 'Agent-1'
    }
    options{
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        ansiColor('xterm')
    }
    environment {
        DEBUG = 'true'
        AWS_REGION = 'us-east-1'
        project = 'expense'
        ECR_REPO_NAME = 'backend'
        ENV = 'dev'
        account_id = '248189912713'
        version = ' '
    }
    stages {
        stage('Resource Checking') {
            steps {
                withAWS(region: ${AWS_REGION}, credentials: 'terraform-aws-credentials') {
                    script {
                       try {
                            // Check if repository exists using AWS CLI with query
                            def repoExists = sh(
                                script: """
                                    aws ecr describe-repositories \
                                        --repository-names ${project}/${ENV}/${ECR_REPO_NAME} \
                                        --region ${AWS_REGION} \
                                        --query 'repositories[0].repositoryName' \
                                        --output text
                                """,
                                returnStdout: true
                            ).trim()

                            if (repoExists == "") {
                                // Create ECR repository if it doesn't exist
                                sh """
                                    aws ecr create-repository \
                                        --repository-name ${project}/${ENV}/${ECR_REPO_NAME} \
                                        --region ${AWS_REGION} \
                                        --image-scanning-configuration scanOnPush=true \
                                        --encryption-configuration encryptionType=AES256
                                """
                                echo "ECR repository '${project}/${ENV}/${ECR_REPO_NAME}' created successfully"
                            } else {
                                echo "ECR repository '${project}/${ENV}/${ECR_REPO_NAME}' already exists"
                            }
                        }
                    }
                }
            }
        }
        stage('') {
            steps {
                withAWS(region: ${AWS_REGION}, credentials: 'terraform-aws-credentials') {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${account_id}.dkr.ecr.us-east-1.amazonaws.com

                        docker build -t ${ENV}/${ECR_REPO_NAME} .

                        docker tag ${ENV}/${ECR_REPO_NAME}:${version} ${account_id}.dkr.ecr.us-east-1.amazonaws.com/dev/backend:${version}

                        docker push ${account_id}.dkr.ecr.us-east-1.amazonaws.com/dev/backend:${version}
                    """
                }
            }
        }
    }
}