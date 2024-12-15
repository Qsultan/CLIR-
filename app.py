from flask import Flask, request, jsonify
from googletrans import Translator
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)

# Create an instance of the Translator class
translator = Translator()

# List of sample topics and descriptions in Chinese related to computer science
documents = [
    "计算机科学是研究计算机及其应用的学科。它包括了计算机硬件、软件、网络、人工智能、算法等多个领域。",
    "机器学习是人工智能的一个分支，专注于通过数据和经验来训练算法，使其能够自主做出决策和预测。",
    "Python是一种广泛使用的高级编程语言，特别适用于数据分析、人工智能、Web开发等多个领域。",
    "数据库管理系统（DBMS）是用于管理数据集合的软件系统，允许用户创建、读取、更新和删除数据。",
    "计算机算法是解决特定问题的一系列步骤，它们是计算机程序设计的核心。常见的算法包括排序算法、查找算法等。"
]

# Function to translate text from one language to another
def translate_text(text, target_language='en'):
    return translator.translate(text, dest=target_language).text

# Function to compute similarity and rank documents
def rank_documents(query, documents):
    # Translate documents into English
    translated_documents = [translate_text(doc, target_language='en') for doc in documents]
    
    # Translate the query to Chinese (for consistency with your original setup)
    translated_query = translate_text(query, target_language='zh-cn')
    
    # Translate the query back to English for similarity comparison
    translated_query_english = translate_text(translated_query, target_language='en')
    
    # Vectorize the documents and the translated query using TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(translated_documents + [translated_query_english])
    
    # Separate the query vector from document vectors
    query_vector = tfidf_matrix[-1]
    document_vectors = tfidf_matrix[:-1]
    
    # Compute cosine similarity between the query and each document
    cosine_similarities = cosine_similarity(query_vector, document_vectors)
    
    # Rank documents based on cosine similarity score
    similarity_scores = cosine_similarities.flatten()
    ranked_indices = np.argsort(similarity_scores)[::-1]  # Sort in descending order
    
    # Return ranked documents along with their similarity scores
    ranked_documents = [(documents[i], translated_documents[i], similarity_scores[i]) for i in ranked_indices]
    
    return translated_query, translated_query_english, ranked_documents

# Flask route to handle the query from React
@app.route('/get_similar_documents', methods=['GET','POST'])
def get_similar_documents():
    query = request.json.get('query')  # Get the query from React frontend
    translated_query, translated_query_english, ranked_documents = rank_documents(query, documents)
    
    # Prepare the response
    result = {
        "original_query": query,
        "translated_query_chinese": translated_query,
        "translated_query_english": translated_query_english,
        "ranked_documents": [
            {"original": doc[0], "translated": doc[1], "similarity_score": doc[2]} 
            for doc in ranked_documents
        ]
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
